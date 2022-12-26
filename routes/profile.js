var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('profile', { title: 'Profile | NSM', header: 'Profile', user: res.locals.user, username: res.locals.username, userpermissions: res.locals.permissions });
});

module.exports = router;
