'use strict'

const serverless = require('serverless-http');
//=================== Load environment configuration
require('dotenv').config();
//=================== Modules
const express = require('express'),
  app = express(),
  port = process.env.port || 3000,
  bodyParser = require('body-parser'),
  glob = require('glob'),
  path = require('path'),
  mongoose = require('mongoose'),
  eValidator = require('express-validator'),
  cors = require('cors');

app.use(bodyParser.json({
  strict: false,
  limit:'20mb'
}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(eValidator());
app.use(cors());
//==================== Mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    ssl: true
  })
  .then(() => {

  }).catch(err => { // we will not be here...
    console.error('App starting error:', err.stack);
    process.exit(1);
  });
// =================== Automatically require all routes and controllers
glob.sync('./routes/*.js').forEach((file) => {
  require(path.resolve(file))(app);
});


app.route('/robles-test').get((req, res) => {
  res.json({success:'hola mundo'});
})


//==================== Start server listening
app.listen(port,function(){
  console.log('server local running on port 3000');
});