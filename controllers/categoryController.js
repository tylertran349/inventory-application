const Category = require("../models/category");
const Item = require("../models/item");
const async = require("async");
const {body, validationResult} = require("express-validator");

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
exports.category_create_get = (req, res, next) => {
  res.render("category_form", {title: "Create Category"});
};

// Handle Category create on POST.
exports.category_create_post = [
  body("name", "Category name required").trim().isLength({min: 1}).escape(), // Check if input has at least 1 character, remove starting/ending whitespace, and remove HTML characters
  
  // Process request after validation adn sanitization of input
  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data
    const category = new Category({ name: req.body.name });

    if(!errors.isEmpty()) {
      // If this if loop runs, that means there are errors so render the form again with sanitized values/error messages
      res.render("category_form", {
        title: "Create Category",
        category,
        errors: errors.array(),
      });
    } else {
      // If this else loop runs, that means the form data is valid

      // Check if a Category with the same name already exists
      Category.findOne({ name: req.body.category }).exec((err, found_category) => {
        if(err) {
          return next(err);
        }

        if(found_category) {
          // Category exists so redirect to its detail page
          res.redirect(found_category.url);
        } else {
          // Category does not exist so save the new Category
          category.save((err) => {
            if(err) {
              return next(err);
            }
            // Category saved, redirect to detail page of new category we just created
            res.redirect(category.url);
          });
        }
      });
    }
  },
];

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
