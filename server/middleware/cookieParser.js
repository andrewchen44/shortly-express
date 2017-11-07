var qs = require('querystring');

const parseCookies = (req, res, next) => {
  
  if (req.headers.cookie) {
    var cookie = req.headers.cookie + '';
    if ( cookie.indexOf(';') >= 0 ) {
      var obj = {};
      var cookieArr = cookie.split(';');
      for (var i = 0; i < cookieArr.length; i++) {
        if (cookieArr[i][0] === ' ') {
          cookieArr[i] = cookieArr[i].slice(1);
        }
        var pairs = cookieArr[i].split('=');
        obj[pairs[0]] = pairs[1];
      }
    } else {
      var pairs = cookie.split('=');
      var obj = {};
      obj[pairs[0]] = pairs[1];
      req.cookies = obj;
    }
    req.cookies = obj;   
  }

  next();
};

module.exports = parseCookies;
