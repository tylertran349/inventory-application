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
  // Get all categories
  async.parallel({
    categories(callback) {
      Category.find(callback);
    },
  },
  (err, results) => {
    if(err) {
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
exports.item_create_post = [
  // Convert the category to an array
  (req, res, next) => {
    if(!Array.isArray(req.body.category)) {
      req.body.category = typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize form fields
  body("name", "Name must not be empty").trim().isLength({min: 1}).escape(),
  body("description", "Description must not be empty").trim().isLength({min: 1}).escape(),
  body("category.*").escape(),
  body("launch_date", "Invalid launch date").isLength({min: 1}).isISO8601().toDate(),

  // Process request after validation and sanitization
  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create an Item object with escaped and trimmed data
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      launch_date: req.body.launch_date,
    });

    if(!errors.isEmpty()) {
      // If the if statement runs, that means there are errors so render the form again with sanitized values/error messages

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
          title: "Create Category",
          categories: results.categories,
          errors: errors.array(),
        });
      }
      );
      return;
    }

    // Data from form is valid so save the item
    item.save((err) => {
      if(err) {
        return next(err);
      }
      // Successful so redirect to webpage of new item that was just created
      res.redirect(item.url);
    });
  },
];

// Display Item delete form on GET.
exports.item_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item delete GET");
};

// Handle Item delete on POST.
exports.item_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item delete POST");
};

// Display Item update form on GET.
exports.item_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item update GET");
};

// Handle Item update on POST.
exports.item_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item update POST");
};