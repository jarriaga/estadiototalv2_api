'use strict'

var jwt = require('../middleware/jwt');
var userEmail = require('../emails/userEmail');

module.exports = (app) => {
  //load User controller
  var tournament = require('../controllers/tournamentController');

  //protected routes
  //================== TOURNAMENT METHODS
  app.route('/tournament/list').post(jwt.validate_route,tournament.get_tournament_list);

}
