const Category = require("../models/category");
const Item = require("../models/item");
const async = require("async");

// Display list of all Categories.
exports.category_list = function(req, res, next) {
  Category.find()
    .sort([["name", "ascending"]]) // Sort all Category objects in alphabetic order
    .exec(function(err, list_categories) {
      if(err) {
        return next(err); // If there is an error, call the next middleware function with the error value
      }
      // Successful so render category_list.pug template, passing the page title and list of categories (list_categories)
      res.render("category_list", {
        title: "Category List",
        category_list: list_categories
      });
    });
};

// Display detail page for a specific Category.
exports.category_detail = (req, res, next) => {
  // Use async.parallel() to query the category name and its associated items in parallel
  async.parallel({
    category(callback) {
      Category.findById(req.params.id).exec(callback); // Get the current category by accessing the ID in the URL via req.params.id
    },
    category_items(callback) {
      Item.find({ category: req.params.id}).exec(callback);
    },
  },
  (err, results) => {
    if(err) {
      return next(err);
    }
    if(results.category == null) {
      const err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }
    // Render list of all items associated with each category if requests for category name and its associated items complete successfully
    res.render("category_detail", {
      title: "Category Details",
      category: results.category,
      category_items: results.category_items
    });
  }
  );
};

// Display Category create form on GET.
exports.category_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Category create GET");
};

// Handle Category create on POST.
exports.category_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Category create POST");
};

// Display Category delete form on GET.
exports.category_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Category delete GET");
};

// Handle Category delete on POST.
exports.category_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Category delete POST");
};

// Display Category update form on GET.
exports.category_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Category update GET");
};

// Handle Category update on POST.
exports.category_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Category update POST");
};
