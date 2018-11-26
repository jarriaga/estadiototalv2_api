'use strict'

const User = require('../models/userModel'),
  Tournament = require('../models/tournamentModel'),
  userEmail = require('../emails/userEmail'),
  _ = require('lodash'),
  randomstring = require('randomstring'),
  jwt = require('../middleware/jwt'),
  bcrypt = require('bcryptjs'),
  storage = require('../helpers/storage');


//================= get Tournaments list
exports.get_tournament_list = (req, res) => {
  let userId = req.jwt._id;
  Tournament.find({'admin.adminId': userId}, ( err,tournament ) => {
    if(err) return console.log('error');
    tournament = tournament.map( item => { 
      item = item.toObject();
      delete item.config; return item; 
    });
    res.json(tournament);
  });  
}

