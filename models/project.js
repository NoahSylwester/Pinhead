const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: { type: String, required: true, default: "New Project" },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  image: {
    type: Buffer,
    required: false,
  },
  date_created: {
    type: Date,
    required: true,
    default: Date.now,
  },
  markers: [{ type: Schema.Types.ObjectId, ref: "Marker" }],
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;