const db = require("../models");

// Defining methods for the MarkersController
module.exports = {
  findAll: function(req, res) {
    db.Marker
      .find(req.query)
      .populate("author", "_id name")
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.Marker
      .findById(req.params.id)
      .populate({
        path: 'replies',
        populate: { path: 'author', select: "_id name"}
      })
      .populate("author", "_id name")
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    console.log("BODY: ", req.body)
    db.User.findById(req._id)
      .then(function({ _id }) {
      db.Marker
        .create({
          ...req.body,
          author: _id,
        })
        .then(marker => {
          console.log("MARKER: ", marker)
          db.Project.findOneAndUpdate({ _id: req.body.project }, { $push: { markers: marker._id } }, { new: true })
          .then((entity) => {
            console.log("ENTITY: ", entity)
            return res.json(marker)
          })
        })
        .catch(err => res.status(422).json(err));
      })
    .catch(err => res.status(422).json(err));
  },
  update: function(req, res) {
    console.log(req.body)
    db.Marker
      .findOneAndUpdate({ _id: req.params.id }, req.body.marker, { new: true })
      .populate("author", "_id name")
      .then(dbModel => {
        console.log(dbModel)
        res.json(dbModel)
      })
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    console.log(req.body)
    db.Marker
      .deleteOne({ _id: req.params.id })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
