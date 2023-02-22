const ItemInstance = require("../models/iteminstance");

// Display list of all ItemInstances.
exports.iteminstance_list = function(req, res, next) {
  ItemInstance.find()
    .populate("item")
    .exec(function(err, list_iteminstances) {
      if(err) {
        return next(err);
      }
      // Successful so pass title and iteminstance_list to iteminstance_list template and render the item instance list
      res.render("iteminstance_list", {
        title: "Item Instance List",
        iteminstance_list: list_iteminstances
      });
    });
};

// Display detail page for a specific ItemInstance.
exports.iteminstance_detail = (req, res, next) => {
  ItemInstance.findById(req.params.id) // Find a item instance with the ID of a specific Item instance extracted from the URL
    .populate("item") // Get the details of the associated item
    .exec((err, iteminstance) => {
      if(err) {
        return next(err);
      }
      if(iteminstance == null) {
        // No results
        const err = new Error("This item is not available right now.");
        err.status = 404;
        return next(err);
      }
      // Successful so render iteminstance_detail.pug template
      res.render("iteminstance_detail", {
        name: `SKU: ${iteminstance.item.title}`,
        iteminstance,
      });
    });
};

// Display ItemInstance create form on GET.
exports.iteminstance_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: ItemInstance create GET");
};

// Handle ItemInstance create on POST.
exports.iteminstance_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: ItemInstance create POST");
};

// Display ItemInstance delete form on GET.
exports.iteminstance_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: ItemInstance delete GET");
};

// Handle ItemInstance delete on POST.
exports.iteminstance_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: ItemInstance delete POST");
};

// Display ItemInstance update form on GET.
exports.iteminstance_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: ItemInstance update GET");
};

// Handle ItemInstance update on POST.
exports.iteminstance_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: ItemInstance update POST");
};