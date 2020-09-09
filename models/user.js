require('dotenv').config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const saltRounds = 15;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  threads: [{ type: Schema.Types.ObjectId, ref: "Thread" }],
  snippets: [{ type: Schema.Types.ObjectId, ref: "Snippet" }],
  authority: { type: String, required: true, default: "Unauthorized" }
});

/*
authority options:
Owner
Admin
Authorized
Unauthorized
*/

UserSchema.pre('save', function(next) {
  // Check if document is new or a new password has been set
  if (this.isNew || this.isModified('password')) {
    // Saving reference to this because of changing scopes
    const document = this;
    bcrypt.hash(document.password, saltRounds,
      function(err, hashedPassword) {
      if (err) {
        next(err);
      }
      else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});

UserSchema.methods.isCorrectPassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, same){
    if (err) {
      callback(err);
    } else {
      callback(err,same);
    }
  });
}

const User = mongoose.model("User", UserSchema);

module.exports = User;