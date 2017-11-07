const parseCookies = (req, res, next) => {
  console.log(req.cookies);
  var body = '';
  req.on('data', (err, chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    console.log(body);
  });
};

module.exports = parseCookies;

// In middleware/cookieParser.js, write a middleware function that will access the cookies on an incoming request, parse them into an object, and assign this object to a cookies property on the request.