'use strict'

var jwt = require('../middleware/jwt');
var userEmail = require('../emails/userEmail');

module.exports = (app) => {
  //load User controller
  var user = require('../controllers/userController');
  //user routes - no protected
  app.route('/user/signup').post(user.signup_new_user);
  app.route('/activation/:code').get(user.activate_user);
  app.route('/login').post(user.login_user);
 app.route('/email-test').get(function(req, res){
     userEmail.activation_email({firstName:'Jesus',email:'jarriagabarron@gmail.com'});
 });

  //protected routes
  //================== USER METHODS
  app.route('/user/password/update').post(jwt.validate_route,user.password_update);
  app.route('/user/profile/photo').post(jwt.validate_route,user.upload_photo);
  app.route('/user/scope').post(jwt.validate_route,user.user_scope);

}
