const Item = require("../models/item");
const Category = require("../models/category");
const ItemInstance = require("../models/iteminstance");
const { body, validationResult } = require("express-validator");
const async = require("async");

exports.index = (req, res) => {
  async.parallel(
    {
      item_count(callback) {
        Item.countDocuments({}, callback);
      },
      item_instance_available_count(callback) {
        ItemInstance.countDocuments({ condition: {$in: ['New', 'Used', 'Refurbished', 'Open-box']} }, callback);
      },
      category_count(callback) {
        Category.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "One-Stop Computer Shop",
        error: err,
        data: results,
      });
    }
  )
}

// Display list of all Items.
exports.item_list = (req, res) => {
  Item.find({}, "name category")
    .sort({ name: 1 }) // Sorts results by item name alphabetically
    .populate("category") // Replaces stored item category id with full category details
    .exec(function(err, list_items) {
      if(err) {
        return next(err);
      }
      // Successful so render
      res.render("item_list", { title: "Item List", item_list: list_items });
    });
};

// Display detail page for a specific Item.
exports.item_detail = (req, res, next) => {
  async.parallel({
    item(callback) {
      Item.findById(req.params.id)
        .populate("category")
        .exec(callback);
    },
    item_instance(callback) {
      ItemInstance.find({ item: req.params.id }).exec(callback);
    },
  },
  (err, results) => {
    if(err) {
      return next(err);
    }
    if(results.item == null) {
      // This means there were no results found
      const err = new Error("Item not found");
      err.status = 404;
      return next(err);
    }
    // If item query is successful, render item_detail.pug template
    res.render("item_detail", {
      name: results.item.name,
      item: results.item,
      item_instances: results.item_instance,
    });
  }
  );
};

// Display Item create form on GET.
exports.item_create_get = (req, res, next) => {
  // Get all categories, which we can use for adding to our item
  async.parallel(
    {
      categories(callback) {
        Category.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("item_form", {
        title: "Create Item",
        categories: results.categories,
      });
    }
  );
};


// Handle Item create on POST.
// Handle book create on POST.
exports.item_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("launch_date", "Invalid launch date").optional({checkFalsy: true}).isISO8601().toDate(),
  body("category.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      launch_date: req.body.launch_date, 
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all categories for the form
      async.parallel(
        {
          categories(callback) {
            Category.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          // Mark our selected genres as checked.
          for (const category of results.categories) {
            if (item.category.includes(category._id)) {
              category.checked = "true";
            }
          }
          res.render("item_form", {
            title: "Create Item",
            categories: results.categories,
            item,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Save book.
    item.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to new book record.
      res.redirect(item.url);
    });
  },
];

// Display Item delete form on GET.
exports.item_delete_get = (req, res, next) => {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id).populate("category").exec(callback);
      },
      item_iteminstances(callback) {
        ItemInstance.find({ item: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.item == null) {
        // No results.
        res.redirect("/catalog/items");
      }
      // Successful, so render.
      res.render("item_delete", {
        title: "Delete Item",
        item: results.item,
        item_instances: results.item_iteminstances,
      });
    }
  );
};

// Handle Item delete on POST.
exports.item_delete_post = (req, res, next) => {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.body.id).populate("category").exec(callback);
      },
      item_iteminstances(callback) {
        ItemInstance.find({ item: req.body.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.item_iteminstances.length > 0) {
        // Item has item_instances. Render in same way as for GET route.
        res.render("item_delete", {
          title: "Delete Item",
          item: results.item,
          item_instances: results.item_iteminstances,
        });
        return;
      }
      // Item has no ItemInstance objects. Delete object and redirect to the list of items.
      Item.findByIdAndRemove(req.body.id, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to item list
        res.redirect("/catalog/items");
      });
    }
  );
};


// Display Item update form on GET.
exports.item_update_get = (req, res, next) => {
  async.parallel({
    // Get the id of the Item to be updated from req.params.id
    item(callback) {
      Item.findById(req.params.id).populate("category").exec(callback);
    },
    // Get the list of all category objects
    categories(callback) {
      Category.find(callback);
    },
  },
  (err, results) => {
    if(err) {
      return next(err);
    }
    if(results.item == null) {
      // No Item matching the request id was found
      const err = new Error("Item not found");
      err.status = 404;
      return next(err);
    }
    // A matching item was successfully found, mark the currently selected categories as checked
    for(const category of results.categories) {
      for(const itemCategory of results.item.category) {
        if(category._id.toString() === itemCategory._id.toString()) {
          category.checked = "true";
        }
      }
    }
    res.render("item_form", {
      title: "Update Item",
      item: results.item,
      categories: results.categories,
    });
  }
  );
};

// Handle Item update on POST.
exports.item_update_post = [
  // Convert the category to an array
  (req, res, next) => {
    if(!Array.isArray(req.body.category)) {
      req.body.category = typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields
  body("name", "Name must not be empty.").trim().isLength({min: 1}).escape(),
  body("description", "Description must not be empty.").trim().isLength({min: 1}).escape(),
  body("category.*").escape(),
  body("launch_date", "Invalid launch date").optional({ checkFalsy: true }).isISO8601().toDate(),

  // Process request after validation and sanitization
  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create an Item object with escaped/trimmed data and old id
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: typeof req.body.category === "undefined" ? [] : req.body.category,
      launch_date: req.body.launch_date,
      _id: req.params.id, // Must include this or else a new ID will be assigned to this Item
    });

    if(!errors.isEmpty()) {
      // There are errors so render the form again with sanitzed values/error messages

      // Get all categories for form
      async.parallel({
        categories(callback) {
          Category.find(callback);
        },
      },
      (err, results) => {
        if(err) {
          return next(err);
        }

        // Mark our selected categories as checked
        for(const category of results.categories) {
          if(item.category.includes(category._id)) {
            category.checked = "true";
          }
        }
        res.render("item_form", {
          title: "Update Item",
          categories: results.categories,
          item,
          errors: errors.array(),
        });
      }
      );
      return;
    }

    // Date from form is valid so update the record
    Item.findByIdAndUpdate(req.params.id, item, {}, (err, item) => {
      if(err) {
        return next(err);
      }

      // Successful, redirect to item detail page
      res.redirect(item.url)
    })
  }
]