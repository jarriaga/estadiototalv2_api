'use strict'

var User = require('../models/userModel'),
  userEmail = require('../emails/userEmail'),
  _ = require('lodash'),
  randomstring = require('randomstring'),
  jwt = require('../middleware/jwt'),
  bcrypt = require('bcryptjs'),
  storage = require('../helpers/storage');


//================= Method POST to submit a new user
exports.signup_new_user = (req, res) => {
  var errors = req.validationErrors();
  //if errors exists return
  if (errors)
    res.status(400).json({
      errors: returnError(errors)
    });
  //Search for a user with email
  User.findOne({
    'email': req.body.email
  }, function (err, _user) {
    if (err) return console.log("************ " + err);
    //if user exist return error
    if (_user) {
      res.status(400).json({
        error: 'user-exists'
      });
    } else {
      let username = (req.body.username).toLowerCase();
      User.findOne({
        'username': username
      }, function (err, _user) {
        if (_user) {
          res.status(400).json({
            error: 'username-exists'
          });
        }
        //create new user
        let user = new User({
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10),
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: username,
          country: req.body.country || null,
          state: req.body.state || null,
          city: req.body.city || null,
          active: false,
          activationCode: randomstring.generate()
        });
        //save new user to database
        user.save((err, _user) => {
          if (err) return console.log("************ " + err);
          userEmail.activation_email(_user);
          res.json({
            success: 'usuario creado'
          });
        });
      });

    }

  }); //close User.findOne
};

//==================== Method GET to Activate user by using a activation code through email
exports.activate_user = (req, res) => {
  //search for activation code
  User.findOne({
    activationCode: req.params.code
  }, function (err, _user) {
    if (err) return console.log("************ " + err);
    //if user exists set active = true and redirect to activated frontend route
    if (_user) {
      _user.activationCode = null;
      _user.active = true;
      _user.save((err) => {
        if (err) return console.log("************ " + err);
        res.redirect(`${process.env.FRONTEND_URL}/account-active`);
      });
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
  });
};
//=================== Method POST to log in a user and return the jwt
exports.login_user = (req, res) => {
  // Validate inputs
  var errors = req.validationErrors();
  //if errors exists return
  if (errors)
    res.status(400).json({
      errors: returnError(errors)
    });
  //find for active user
  User.findOne({
    $or: [{
        email: req.body.email
      },
      {
        username: req.body.email
      }
    ],
    active: true
  }, (err, _user) => {
    if (err) console.log("****************" + err);
    if (_user) {
      if (bcrypt.compareSync(req.body.password, _user.password)) {
        _user = _user.toObject();
        delete _user.password;
        delete _user.active;
        delete _user.activationCode;
        res.json({
          success: 'user-authenticated',
          user: _user,
          token: jwt.generate_token(_user)
        });
      } else {
        res.status(400).json({
          error: 'invalid-password'
        });
      }
    } else {
      res.status(400).json({
        error: 'user-not-found'
      });
    }
  });
};

//================== FORGOT PASSWORD
//========== method to send a reset password link to a user
exports.forgot_password = (req, res) => {
  console.log(req.body.email);
  //find user
  User.findOne({
    email: req.body.email
  }, (err, _user) => {
    if (err) {
      console.log("****************" + err);
      return res.status(400).json({
        error: 'user-not-found'
      });
    }

    if (_user) {
      _user.recoveryCode = randomstring.generate();
      _user.save(err => {
        userEmail.resetpassword_email(_user);
        _user = _user.toObject();
        delete _user.password;
        console.log(_user);
        return res.json({ok:'ok'});
      });
    }
  });
};

//================ Method to update user's password
exports.password_update = (req, res) => {
  //find for user
  User.findOne({
    _id: req.jwt._id
  }, (err, _user) => {
    if (err) return console.log("****************" + err);
    //if user was found
    if (_user) {
      _user.password = bcrypt.hashSync(req.body.password, 10);
      _user.save(err => {
        if (err) return console.log("****************" + err);
        res.json({
          success: 'password-updated'
        });
      });
    } else {
      res.status(400).json({
        error: 'user-not-found'
      });
    }
  });
};

exports.password_recover = (req, res) => {
  //find for user
  console.log("hola");
  console.log(req.body.token);
  User.findOne({
    recoveryCode: req.body.token
  }, (err, _user) => {
    if (err) return console.log("****************" + err);
    console.log(_user)
    //if user was found
    if (_user) {
      _user.password = bcrypt.hashSync(req.body.password,10);
      _user.recoveryCode='';
      _user.save(err => {
        if (err) return console.log("****************" + err);
        res.json({
          success: 'password-updated'
        });
      });
    } else {
      res.status(400).json({
        error: 'user-not-found'
      });
    }
  });
};
//=============== Method to Upload user's photo profile
exports.upload_photo = (req, res) => {
  var uploadingFile = storage.save_profile_photo_base64(req);
  uploadingFile.send((err, data) => {
    if (err) return console.log("****************" + err);
  });
  //once file is completed
  uploadingFile.on('complete', (response) => {
    //Update the user photo profile
    User.update({
        _id: req.jwt._id
      }, {
        $set: {
          profilePicture: `${process.env.S3_BUCKET}/textoclick/${response.request.params.Key}?v=${Date.now()}`
        }
      },
      (err) => {
        if (err) return console.log("****************" + err);
        //get the user info and return to client
        User.findOne({
          _id: req.jwt._id
        }, (err, _user) => {
          if (err) return console.log("****************" + err);
          _user = _user.toObject();
          delete _user.password;
          delete _user.active;
          delete _user.activationCode;
          res.json({
            success: 'profile-picture-uploaded',
            file: `${process.env.S3_BUCKET}/textoclick/${response.request.params.Key}?v=${Date.now()}`,
            user: _user
          });
        });
      });
  });
};

//================ Method to review the user scope
exports.user_scope = (req, res) => {

}
//============== Return parsed errors
var returnError = (errors) => {
  var result = [];
  _.each(errors, function (value) {
    result.push(_.omit(value, 'location'));
  });
  return result;
}