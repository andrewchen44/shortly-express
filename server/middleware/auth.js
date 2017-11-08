const models = require('../models');
const Promise = require('bluebird');
const session = require('../models/session');

module.exports.createSession = (req, res, next) => {
  var id = req.userId;
  //if it doesn't have a cookie
  if (!req.cookies) {
    //create new session and get hash
    return new Promise ((resolve, reject) => {
      resolve(session.create());
    }).then ( (promise) => {
      return session.get({id: promise.insertId});
    }).then( (obj) => {
      req.session = {};
      req.session['hash'] = obj.hash;
    }).then( () => {
      res.cookie('shortlyid', req.session['hash'], {httpOnly: true});
    }).then ( () => {
      session.update({hash: req.session['hash']}, {userId: id});
    }).then ( () => {
      next();
    });
  } else {
    //if it has a cookie
    return new Promise ((resolve, reject) => {
      resolve(session.create());
    }).then ( (promise) => {
      return session.get({id: promise.insertId});
    }).then( (obj) => {
      req.session = {};
      req.session['hash'] = obj.hash;
    }).then( () => {
      res.cookie('shortlyid', req.session['hash'], {httpOnly: true});
    }).then ( () => {
      return session.get({hash: req.session['hash']});
      
    }).then ( (obj) => {
      session.update({hash: req.session['hash']}, {userId: id});
      console.log(obj);
      var newObj = Object.assign({}, obj);
      var user = Object.assign({}, newObj.user);
    
      req.session.user = {};
      req.session.user.username = user.username;
      req.session.userId = user.userId;
    }).then( () => {
      next();
    });

  }
  //if there are no cookies on request
    //request.session

  
  
  
  
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

