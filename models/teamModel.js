'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TeamSchema = new Schema({
  name: String,
  nameShort: String,
  badge: { type:String, default: 'defaultTeam.jpg'},
  players:[{
    jerseyNumber: Number,
    position: String,
    email: String,
    administrator: Number,
    userId:{ type: Schema.Types.ObjectId, ref:'User' }
  }],
  status: String,
  
}, {
  timestamps: true
});

module.exports = mongoose.model('Team', TeamSchema);