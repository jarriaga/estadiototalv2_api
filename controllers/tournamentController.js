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

  
}

