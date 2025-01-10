var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const bodyParser = require('body-parser');

// middleware to validate the logout token
const requiresValidLogoutToken = require('../middlewares/validateLogoutToken');

//middleware to parse form data
router.use(bodyParser.urlencoded({ extended: true}));
router.use(bodyParser.json());

// new route to receive backchannel logout tokens
// note that the built-in route created is /backchannel-logout
router.post(
  '/backchannel-logout-custom',
  requiresValidLogoutToken,
  function (req, res, next) {
    // at this point the logout token is valid, checked by requiresValidLogoutToken middleware
    // you can access it from the request object: req.logoutToken
    console.log("SID From decoded logout token: " + req.logoutToken.sid);
    console.log("Current sid: " + user.sid);
    if(req.logoutToken.sid == user.sid){
      res.sendStatus(200);
      //kill session
    } else {
      res.sendStatus(400, "Incorrect sid");
    }

    // delete user session so the user gets logged out
    // req.session.destroy(
    //   req.logoutToken.sid
    // );
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
