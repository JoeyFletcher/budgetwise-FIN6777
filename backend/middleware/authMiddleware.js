// authMiddleware.js

const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden. Invalid token.' }); // Token verification failed
      }
      req.user = user; // Attach the user information from the token to the request
      next(); // Continue to the next middleware or route handler
    });
  } else {
    res.status(401).json({ error: 'Unauthorized. No token provided.' }); // No token provided in the request
  }
};

module.exports = authenticate;
