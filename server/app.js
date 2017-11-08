const express = require('express');
const path = require('path');
const utils = require('./lib/hashUtils');
const partials = require('express-partials');
const bodyParser = require('body-parser');
const Auth = require('./middleware/auth');
const models = require('./models');
const qs = require('querystring');
const db = require('./db');


const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(partials());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));




app.get('/', 
(req, res) => {

  return new Promise ((resolve, reject) => {
    resolve(Auth.createSession(req, res, function(){}))
  }).then( () => {
    res.render('index');
  });

});

app.get('/create', 
(req, res) => {
  res.render('index');
});

app.get('/links', 
(req, res, next) => {
  models.Links.getAll()
    .then(links => {
      res.status(200).send(links);
    })
    .error(error => {
      res.status(500).send(error);
    });
});

app.post('/links', 
(req, res, next) => {
  var url = req.body.url;
  if (!models.Links.isValidUrl(url)) {
    // send back a 404 if link is not valid
    return res.sendStatus(404);
  }

  return models.Links.get({ url })
    .then(link => {
      if (link) {
        throw link;
      }
      return models.Links.getUrlTitle(url);
    })
    .then(title => {
      return models.Links.create({
        url: url,
        title: title,
        baseUrl: req.headers.origin
      });
    })
    .then(results => {
      return models.Links.get({ id: results.insertId });
    })
    .then(link => {
      throw link;
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(link => {
      res.status(200).send(link);
    });
});

/************************************************************/
// Write your authentication routes here
/************************************************************/

app.get('/login', (req, res, next) => {
  res.render('login');
});

app.post('/login', 
(req, res, next) => {
  db.query(`SELECT * FROM users WHERE users.username = "${req.body.username}"`, function(err, results) {
    if (results.length === 0) {
      res.redirect('/login');
    } else {
      //check for correct password
      db.query(`SELECT users.* FROM users WHERE users.username = "${req.body.username}"`, function(err, results) {
        let actual = results[0].password;
        let salt = results[0].salt;
        let attempted = req.body.password;
        if (!utils.compareHash(attempted, actual, salt)) {
          res.redirect('/login');
        } else {
          res.redirect('/');
        }
      }); 
    }
  });  

});

//sends to signup page
app.get('/signup', (req, res, next) => {
  res.render('signup');
});

//create a new user pass in table
app.post('/signup', (req, res, next) => {
  db.query(`SELECT * FROM users WHERE users.username = "${req.body.username}"`, function(err, results) {
    if (results.length === 0) {
      return new Promise((resolve, reject) => {
        resolve(models.Users.create(req.body));
      }).then( (promise) => {
        req.userId = promise.insertId;
        return Auth.createSession(req, res, next);
      }).then( () => {
        res.redirect('/');
      });
    } else {
      res.redirect('/signup');
    }
  });  
});


/************************************************************/
// Handle the code parameter route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/:code', (req, res, next) => {

  return models.Links.get({ code: req.params.code })
    .tap(link => {

      if (!link) {
        throw new Error('Link does not exist');
      }
      return models.Clicks.create({ linkId: link.id });
    })
    .tap(link => {
      return models.Links.update(link, { visits: link.visits + 1 });
    })
    .then(({ url }) => {
      res.redirect(url);
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(() => {
      res.redirect('/');
    });
});

module.exports = app;
