const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemInstanceSchema = new Schema({
    item: {type: Schema.Types.ObjectId, ref: "Item", required: true},
    condition: {type: String, required: true, enum: ["In stock", "Out of stock"], default: "In stock" },
    price: { type: Number, required: true }
});

// Virtual for ItemInstance's URL
ItemInstanceSchema.virtual("url").get(function() {
    return `/catalog/iteminstance/${this._id}`
})

// Export model
module.exports = mongoose.model("ItemInstance", ItemInstanceSchema);