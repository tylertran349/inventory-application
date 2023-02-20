const express = require("express");
const router = express.Router();

// Require controller modules.
const item_controller = require("../controllers/itemController");
const category_controller = require("../controllers/categoryController");
const iteminstance_controller = require("../controllers/iteminstanceController");

/// ITEM ROUTES ///

// GET catalog home page
router.get("/", item_controller.index);

// GET request for creating an Item
router.get("/item/create", item_controller.item_create_get);

// POST request for creating an Item
router.post("/item/create", item_controller.item_create_post);

// GET request to delete Item
router.get("/item/:id/delete", item_controller.item_delete_get);

// POST request to delete Item
router.post("/item/:id/delete", item_controller.item_delete_post);

// GET request to update Item
router.get("/item/:id/update", item_controller.item_update_get);

// POST request to update Item
router.post("/item/:id/update", item_controller.item_update_post);

// GET request for one Item
router.get("/item/:id", item_controller.item_detail);

// GET request for list of all Item items.
router.get("/items", item_controller.item_list);

/// CATEGORY ROUTES ///

// GET request for creating a Category
router.get("/category/create", category_controller.category_create_get);

//POST request for creating Category
router.post("/category/create", category_controller.category_create_post);

// GET request to delete Category
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete Category
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update Category
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update Category
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one Category
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all Categories
router.get("/categories", category_controller.category_list);

/// ITEMINSTANCE ROUTES ///

// GET request for creating an ItemInstance
router.get("/iteminstance/create", iteminstance_controller.iteminstance_create_get);

// POST request for creating an ItemInstance
router.get("/iteminstance/create", iteminstance_controller.iteminstance_create_post);

// GET request to delete an ItemInstance
router.get("/iteminstance/:id/delete", iteminstance_controller.iteminstance_delete_get);

// POST request to delete an ItemInstance
router.get("/iteminstance/:id/delete", iteminstance_controller.iteminstance_delete_post);

// GET request to update an ItemInstance
router.get("/iteminstance/:id/update", iteminstance_controller.iteminstance_update_get);

// POST request to update an ItemInstance
router.get("/iteminstance/:id/update", iteminstance_controller.iteminstance_update_post);

// GET request for one ItemInstance.
router.get("/iteminstance/:id", iteminstance_controller.iteminstance_detail);

// GET request for list of all ItemInstasnces.
router.get("/iteminstances", iteminstance_controller.iteminstance_list);

module.exports = router;
