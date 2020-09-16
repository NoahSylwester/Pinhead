const db = require("../models");
const fs = require('fs');

// Defining methods for the ProjectsController
module.exports = {
  findAll: function(req, res) {
    db.Project
      .find({ author: req._id })
      .populate("author", "_id name")
      .select("-image")
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  searchAll: async function(req, res) {
    let searchEntity;
    const parseInputs = async function () {
      if (req.body.searchOption === 'title') {
        searchEntity = new RegExp(req.body.searchInput, "i");
      }
      else if (req.body.searchOption === 'topics') {
        searchEntity = { $in: [ req.body.searchInput ] }
      }
      else if (req.body.searchOption === 'author') {
        userSearchEntity = new RegExp(req.body.searchInput, "i");

        const findUser = async function() {
          await db.User
          .find({ name: userSearchEntity })
          .then(dbUser => {
            return searchEntity = dbUser.map((user) => user._id);
          })
          .catch(err => res.status(422).json(err));
        }
        
        await findUser();
      }
      else if (req.body.searchOption === 'content') {
        searchEntity = new RegExp(req.body.searchInput, "i");
      }
    }
    await parseInputs();
    db.Project
      .find({ [req.body.searchOption]: searchEntity })
      .populate("author", "_id name")
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.Project
      .findById(req.params.id)
      .populate("author", "_id")
      .populate("markers")
      .select("-image")
      .then(dbModel => {
        if (dbModel.image) {
          dbModel.image = true;
        }
        res.json(dbModel)
      })
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    db.User.findById(req._id)
    .then(function({ _id }) {
      db.Project
      .create({ ...req.body, author: _id })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
    })
    .catch(err => res.status(422).json(err));
  },
  update: function(req, res) {
    db.Project
      .findOneAndUpdate({ _id: req.params.id }, { ...req.body.project })
      .populate("author", "_id")
      .select("-image")
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  updateImage: function(req, res) {
    // stores image temporarily in file directory
    const imageFile = fs.readFileSync(req.file.path);
    const encode_image = imageFile.toString('base64');
    const finalImg = {
        contentType: req.file.mimetype,
        image:  new Buffer.from(encode_image, 'base64')
    };
    db.Project
      .findOneAndUpdate({ _id: req.params.id }, { ...finalImg, isImageUploaded: true })
      // .populate("author", "_id")
      .select("-image")
      .then(dbModel => {
        fs.unlinkSync(req.file.path)
        return res.json(dbModel)
      })
      .catch(err => {
        console.log(err)
        fs.unlinkSync(req.file.path)
        return res.status(422).json(err)
      });
  },
  remove: function(req, res) {
    db.Project
      .deleteOne({ _id: req.params.id })
      .then(dbModel => {
        db.Marker.deleteMany({ project: req.params.id })
        .then(() => res.json(dbModel))
        .catch(err => res.status(422).json(err));
      })
      .catch(err => res.status(422).json(err));
  },
  serveBinaryImage: function(req, res) {
      db.Project
      .findById(req.params.id)
      .then((result) => {
        res.set('Content-Type', result.contentType);
        res.send(Buffer.from(result.image.buffer));
      })
      .catch(function (err) {
        res.json(err);
      });
  }
};
