'use strict'

const Tournament = require ('./../models/tournamentModel');

const User = require('./../models/userModel');

module.exports = (app) => {
    
    app.route('/load_torneos').get( (req,res) => {
        var db_temporada = require('./DB/temporada.json');
        var db_torneos = require('./DB/torneo.json');

        var temporadas = db_temporada.filter( item => item.creadorid == 78 );
        var torneos_final ;
        var torneos = temporadas.map(  itemTemporada => {
            var torneos_array = db_torneos.filter(  torneo =>  torneo.temporadaid == itemTemporada.temporadaid ).map( torneo =>{
                return { 
                    name: torneo.nombre,
                    description: itemTemporada.nombre,
                    grupos: torneo.grupos,
                }
            } );
            return torneos_array
        });
        
        var x =torneos.reduce(function(previous, current){
            return previous.concat(current);
        });
        
        
        //
        
        User.findOne({ 'email':'jarriagabarron@gmail.com' }, (err, user) => {

       if(err) return console.log('error');

        x.forEach(torneo => {
            let tournament = new Tournament({
                name: torneo.name,
                description: torneo.description,
                config: {
                    pointsWin: 3,
                    pointsLose: 0,
                    pointsDraw: 1,
                    groups:torneo.grupos,
                    registrationFeeTeam: 560,
                    tournamentType: 'Liga',
                  },
                status: 'active',
                rulesLink: 'Reglamento2018.pdf',
                admin: [{owner:true, adminId: user._id}]
            });
            tournament.save();
        });


    });


        res.json(x);
       

    });






}