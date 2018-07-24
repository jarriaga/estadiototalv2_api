'use strict'

var jwt = require('jsonwebtoken');

//============== Validate routes with access token
exports.validate_route = function(req,res,next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'] ;
    if (token) {
    // verifies secret and checks exp
        jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
            if (err) { return res.status(400).json({"error": err}) }
            req.jwt = decoded;
            next(); //no error, proceed
        });
    } else {
        // forbidden without token
        return res.status(403).send({ "error": "token-is-required"});
    }
}
//==============  Method to generate a new token 2h expiration
exports.generate_token = function(obj){
  return jwt.sign(obj,process.env.JWT_KEY,{expiresIn:'2h'})
}
