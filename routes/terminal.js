var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('terminal', { title: 'Terminal | NSM', header: 'Terminal', username: res.locals.username, userpermissions: res.locals.permissions });
});

module.exports = router;
