const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemInstanceSchema = new Schema({
    item: {type: Schema.Types.ObjectId, ref: "Item", required: true},
    condition: {type: String, enum: ["New", "Open-box", "Refurbished", "Used"], default: "In stock" },
    price: { type: Number },
});

// Virtual for ItemInstance's URL
ItemInstanceSchema.virtual("url").get(function() {
    return `/catalog/iteminstance/${this._id}`
});

// Export model
module.exports = mongoose.model("ItemInstance", ItemInstanceSchema);