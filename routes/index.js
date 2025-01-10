var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');

// middleware to validate the logout token
const requiresValidLogoutToken = require('../middlewares/validateLogoutToken');

// new route to receive backchannel logout tokens
// note that the built-in route created is /backchannel-logout
router.post(
  '/backchannel-logout-custom',
  function (req, res, next) {
    // at this point the logout token is valid, checked by requiresValidLogoutToken middleware
    // you can access it from the request object: req.logoutToken
    console.log(req);
    // delete user session so the user gets logged out
    req.session.destroy(
      req.logoutToken.sid
    );

    res.sendStatus(200);
  }
);

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
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
