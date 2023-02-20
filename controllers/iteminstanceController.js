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
exports.iteminstance_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: ItemInstance detail: ${req.params.id}`);
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