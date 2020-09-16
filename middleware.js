const jwt = require('jsonwebtoken');
const path = require("path");

const secret = process.env.SECRET;

const withAuth = function(req, res, next) {
  
  const token = 
      req.body.token ||
      req.query.token ||
      req.headers['x-access-token'] ||
      req.cookies.token;

  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
    // res.sendFile(path.join(__dirname, "./authClient/index.html"));
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        console.log(err)
        res.status(401).send('Unauthorized: Invalid token');
        // res.sendFile(path.join(__dirname, "./authClient/index.html"));
      } else {
        req._id = decoded.hash;
        next();
      }
    });
  }
}

module.exports = withAuth;