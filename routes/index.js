var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Dashboard | NSM', header: 'Dashboard', username: res.locals.username, userpermissions: res.locals.permissions });
});

module.exports = router;
