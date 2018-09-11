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
          subject: 'Registro',
          html: str
        },
        recipients: [{
          address: user.email
        }]
      })
      .then(data => {
        console.log(`new signup email have been sent-----> ${user.email}`);
        console.log('Woohoo! You just sent your first mailing!');
      })
      .catch(err => {
        console.log('Whoops! Something went wrong');
        console.log(err);
      });
  });
} //End   activation_email