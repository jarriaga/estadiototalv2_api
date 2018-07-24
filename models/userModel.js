'use strict'

var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;


var UserSchema = new Schema({
  email:{
    type: String,
    required:'Email is required',
    unique:true,
    index:true,
    lowercase:true,
  },
  username:{
    type: String,
    requires:'username is required',
    unique:true,
  },
  firstName:{
    type:String
  },
  lastName:{
    type:String
  },
  password:{
    type:String
  },
  cellphone:{
    type:String
  },
  country:{
    type:String
  },
  state:{
    type:String
  },
  city:{
    type:String
  },
  profilePicture:{
    type:String
  },
  active:{
    type:Boolean
  },
  activationCode:{
    type:String
  },
  bio:{
    type:String
  },
  dob:{
    type: Date
  },
},{timestamps: true});

module.exports = mongoose.model('User',UserSchema);
