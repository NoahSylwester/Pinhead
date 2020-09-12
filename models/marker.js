const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const markerSchema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: "Project" },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  content: { type: String, required: true, default: "Enter text!" },
  x: Number,
  y: Number,
  date_created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Marker = mongoose.model("Marker", markerSchema);

module.exports = Marker;