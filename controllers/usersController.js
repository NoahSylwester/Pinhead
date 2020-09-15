const db = require("../models");

// Defining methods for the UsersController
module.exports = {
  findAll: function(req, res) {
    db.User
      .find(req.query)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  searchAll: async function(req, res) {
    let searchEntity;
    const parseInputs = async function () {
      if (req.body.searchOption === 'name') {
        searchEntity = new RegExp(req.body.searchInput, "i");
      }
      else if (req.body.searchOption === 'email') {
        searchEntity = new RegExp(req.body.searchInput, "i");
      }
      else if (req.body.searchOption === 'authority') {
        searchEntity = new RegExp("^" + req.body.searchInput + "$", "i");
      }
    }
    await parseInputs();
    db.User
      .find({ [req.body.searchOption]: searchEntity })
      .select("-password")
      .then(dbModel => {
        return res.json(dbModel)
      })
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.User
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    db.User
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function(req, res) {
    db.User
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.User
      .findById({ _id: req.params.id })
      .then(dbModel => {
        const filter = {author: dbModel._id}
        return Promise.all([
          db.Event.find(filter)
            .then((events) => db.Post.deleteMany({event: { $in: events.map((item) => item._id) }}))
            .then(() => db.Event.deleteMany(filter))
            .catch(err => console.log(err)),
          db.Snippet.find(filter)
            .then((snippets) => db.Post.deleteMany({snippet: { $in: snippets.map((item) => item._id) }}))
            .then(() => db.Snippet.deleteMany(filter))
            .catch(err => console.log(err)),
          db.Thread.find(filter)
            .then((threads) => db.Post.deleteMany({thread: { $in: threads.map((item) => item._id) }}))
            .then(() => db.Thread.deleteMany(filter))
            .catch(err => console.log(err)),
          db.Post.updateMany(filter, {content: null})
            .catch(err => console.log(err))
          ])
          .then(() => db.User.deleteOne({_id: dbModel._id}))
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => {
        console.log(err)
        res.status(422).json(err)
      });
  }
};
