const jwt = require('jsonwebtoken');
require('dotenv').config();


function authenticateToken(req, res, next) {
  const token = req.headers['authorization'].split(' ')[1];
//   const token = authHeader && authHeader.split(' ')[1];
  
  console.log("token",token)
  if (token == null) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    //   console.log("authHeader",authHeader)
      if (err) return res.sendStatus(403); 
      console.log("token verify")

    req.user = user; 
    next(); 
  });
}

module.exports = {authenticateToken}