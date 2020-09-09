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
    const entity = req.body.parentEntityType;
    const Entity = entity.charAt(0).toUpperCase() + entity.substring(1);
    db.User.findById(req._id)
      .then(function({ _id }) {
      db.Marker
        .create({
          ...req.body,
          author: _id,
          [req.body.parentEntityType]: req.body.entityId
        })
        .then(Marker => {
          db[Entity].findOneAndUpdate({ _id: req.body.entityId }, { lastActivity: Date.now(), $push: { Markers: Marker._id } }, { new: true })
          .then((entity) => {
            return res.json(Marker)
          })
        })
        .catch(err => res.status(422).json(err));
      })
    .catch(err => res.status(422).json(err));
  },
  createReply: function(req, res) {
    const entity = req.body.parentEntityType;
    const Entity = entity.charAt(0).toUpperCase() + entity.substring(1);
    db.User.findById(req._id)
      .then(function({ _id }) {
        db.Marker
          .create({
            ...req.body,
            author: _id,
            [req.body.parentEntityType]: req.body.entityId
          })
          .then(reply => {
            db[Entity].findOneAndUpdate({ _id: req.body.entityId }, { lastActivity: Date.now() }, { new: true })
            .then(() => {
              db.Marker.findOneAndUpdate({ _id: req.params.id }, { $push: { replies: reply._id } }, { new: true })
              .then(() => res.json(reply))
            })
          })
          .catch(err => res.status(422).json(err));
        })
        .catch(err => res.status(422).json(err));
  },
  update: function(req, res) {
    db.Marker
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .populate("author", "_id name")
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.Marker
      .findOneAndUpdate({ _id: req.params.id }, {content: null}, { new: true })
      .populate({
        path: 'replies',
        populate: { path: 'author', select: "_id name"}
      })
      .populate('author', '_id name')
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
