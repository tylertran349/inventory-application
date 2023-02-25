const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon"); // Import Luxon

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  launch_date: { type: Date }
});

// Virtual for item's URL
ItemSchema.virtual("url").get(function() {
    return `/catalog/item/${this._id}`;
});

// Virtual for item's launch date (formatted with Luxon)
ItemSchema.virtual("launch_date_formatted").get(function() {
  return DateTime.fromJSDate(this.launch_date).toLocaleString(DateTime.DATE_MED); // Format launch date to MM DD, YYYY (e.g. Feb 24, 2023)
});

// Export model
module.exports = mongoose.model("Item", ItemSchema);