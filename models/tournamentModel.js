'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TournamentSchema = new Schema({
  name: String,
  description: String,
  config: {
    pointsWin: Number,
    pointsLose: Number,
    pointsDraw: Number,
    groups: {
      type: Number,
      default: 1
    },
    registrationFeeTeam: Schema.Types.Decimal128,
    tournamentType: String,
  },
  views: {
    type: Number,
    default: 0
  },
  status: String,
  rulesLink: String, 
  teams: [{
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Teams'
    }
  }],
  admin:[{
    owner : { type: Schema.Types.Boolean, default:false,  },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Tournament', TournamentSchema);