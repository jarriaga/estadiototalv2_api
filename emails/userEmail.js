'use strict'

var ejs = require('ejs');
const SparkPost = require('sparkpost');
const sparky = new SparkPost(process.env.SPARKPOST_KEY);

//================= Email for user activation, send right after new user sign up
exports.activation_email = (user) => {
  user.lastName = user.lastName || '';
  user.backend_url = process.env.BACKEND_URL;
  ejs.renderFile(__dirname + '/email-activation-user.html', {
    user: user
  }, {}, function (err, str) {

    if (err) {
      console.log(err)
    }

    sparky.transmissions.send({
        options: {
          sandbox: false
        },
        content: {
          from: 'EstadioTotal.com <no.reply@estadiototal.com>',
          subject: 'Gracias por registrarte',
          html: str
        },
        recipients: [{
          address: user.email
        }]
      })
      .then(data => {
        console.log(`new signup email have been sent-----> ${user.email}`);
      })
      .catch(err => {
        console.log('Whoops! Something went wrong');
        console.log(err);
      });
  });
} //End   activation_email




//************  RESET PASSWORD email

exports.resetpassword_email = (user) => {

  user.lastName = user.lastName || '';
  user.backend_url = process.env.BACKEND_URL;
  user.frontend_url = process.env.FRONTEND_URL;
  ejs.renderFile(__dirname + '/email-reset-password.html', {
    user: user
  }, {}, function (err, str) {
    if (err) {
      return console.log(err)
    }
    sparky.transmissions.send({
        options: {
          sandbox: false
        },
        content: {
          from: 'EstadioTotal.com <no.reply@estadiototal.com>',
          subject: (user.firstName || 'Hey!')+ ', Recupera tu password',
          html: str
        },
        recipients: [{
          address: user.email
        }]
      })
      .then(data => {
        console.log(`reset password email have been sent-----> ${user.email}`);
      })
      .catch(err => {
        console.log('Whoops! Something went wrong');
        console.log(err);
      });
  });

}