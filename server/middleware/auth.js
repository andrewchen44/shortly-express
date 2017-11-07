const models = require('../models');
const Promise = require('bluebird');
const session = require('../models/session');

module.exports.createSession = (req, res, next) => {
  if (Object.keys(req.cookies).length === 0) {
    //create new session and get hash
    session.create();
    return new Promise((resolve, reject) => {
      resolve(session.get({id: 1}));
    }).then( (obj) => {
      req.session = {};
      req.session['hash'] = obj.hash;
      next();
    });
    
  } 
  //if there are no cookies on request
    //request.session
  next();
  
  
  
  
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

