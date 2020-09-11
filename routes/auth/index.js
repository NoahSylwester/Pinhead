require('dotenv').config();
const router = require("express").Router();
const { User } = require('../../models');
const secret = process.env.SECRET;
const jwt = require('jsonwebtoken');
const withAuth = require('../../middleware');

// POST routes to simply check credentials without sending any info
router
.post('/check/user', withAuth, function(req, res) {
    res.status(200).json({ success: 1 })
})

// POST route to register a user
router
.post('/register', function (req, res) {
    console.log(req.body)
    const { email, password, username: name } = req.body;

    User.find({email})
        .then((response) => {
            if (response.length === 0) {
                User.find({name})
                    .then((response) => {
                        if (response.length === 0) {
                            const user = new User({ email, password, name });
                            user.save(function (err) {
                                if (err) {
                                    console.log(err)
                                    res.status(500)
                                        .json({ error: 0 });
                                } else {
                                    res.status(200).json({ success: 1 })
                                }
                            });
                        }
                        else {
                            res.status(409).json({failure: "Username already exists"})
                        }
                    })
            }
            else {
                res.status(409).json({failure: "Email already exists"})
            }
        })
  })
  
  // POST route to login
.post('/login', function (req, res) {
    const { email, password } = req.body;
    User.findOne({ email }, function (err, user) {
        if (err) {
            console.error(err);
            res.status(500)
                .json({
                    error: 'Internal error try again'
                });
        } else if (!user) {
            res.status(401)
                .json({
                    error: 'Incorrect email or password'
                });
        } else {
            user.isCorrectPassword(password, function (err, same) {
                if (err) {
                    res.status(500)
                    console.log(password, same)
                        .json({
                            error: 'Internal error try again'
                        });
                } else if (!same) {
                    console.log(password, same)
                    res.status(401)
                        .json({
                            error: 'Incorrect email or password'
                        });
                } else if (user.authority === "Unauthorized") {
                    res.status(401)
                        .json({
                            error: 'User not yet authorized.'
                        });
                } else {
                    const payload = { hash: user._id };
                    const token = jwt.sign(payload, secret, {
                        expiresIn: '1h'
                    });
                    res.json({token, userId: user._id})
                }
            })
        }
    })
  })

  module.exports = router;