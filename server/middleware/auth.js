const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  console.log(req);
  if (Object.keys(req.cookies).length === 0) {
    req.session = {
      hash: 1
    };
    
  } 
  
  res.cookies = {shortlyid: '1iuygiuygiuugiuyg'};
  console.log('res', res);
  console.log('res.cookies', res.cookies);
  //if there are no cookies on request
    //request.session
  
  
  
  
  next();
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

