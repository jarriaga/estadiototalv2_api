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
exports._new_tournament = (req, res) => {
  let userId = req.jwt._id;
  var errors = req.validationErrors();
  console.log("hola");
  Tournament.find({'admin.adminId': userId}, ( err,tournament ) => {
    if(err) return console.log(error);
    if(tournament){
    console.log(tournament);
    console.log(userId);
  }
  });
  //if errors exists return
  if (errors)
    res.status(400).json({
      errors: returnError(errors)
    });
        //create new user
        let tournament = new Tournament({
          name:req.body.nombre,
          description:req.body.descripcion,
          config:{
          pointsWin:req.body.puntosWin,
          pointsLose:req.body.puntosLose,
          poinsDraw:req.body.puntosDraw,
          groups:req.body.grupos,
          },
          registrationFeeTeam:req.body.costoTorneo,
          status:req.body.estado,
          rulesLink:req.body.reglamentoTorneo,
          admin:[{
            owner : true,
            adminId:userId
          }]
        });
        res.json(tournament); 
        }
