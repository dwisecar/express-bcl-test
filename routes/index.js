var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const bodyParser = require('body-parser');
const express = require('express');

// middleware to validate the logout token
const requiresValidLogoutToken = require('../middlewares/validateLogoutToken');

//middleware to parse form data
router.use(bodyParser.urlencoded({ extended: true}));
router.use(bodyParser.json());

//middleware to have the user object available on all routes?
router.use((req, res, next) => {
  console.log("index.js user: " + JSON.stringify(req.oidc.user));
  if(req.oidc && req.oidc.user){
    res.locals.user = req.oidc.user;
  }
  next();
})

// new route to receive backchannel logout tokens
// note that the built-in route created is /backchannel-logout
router.post(
  '/bcl-custom',
  requiresValidLogoutToken,
  (req, res, next) => {
    
    // at this point the logout token is valid, checked by requiresValidLogoutToken middleware
    // you can access it from the request object: req.logoutToken
    //console.log("SID From decoded logout token: " + req.logoutToken.sid);
    res.sendStatus(200);
  }
);

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Backchannel Logout sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
  });
});

module.exports = router;
