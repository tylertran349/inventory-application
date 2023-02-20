const Item = require("../models/item");
const Category = require("../models/category");
const ItemInstance = require("../models/iteminstance");

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
      ItemInstance.find({ item: req.params.id}).exec(callback);
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
      item_instances: results.item_instance
    });
  }
  );
};

// Display Item create form on GET.
exports.item_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item create GET");
};

// Handle Item create on POST.
exports.item_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item create POST");
};

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