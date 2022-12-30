var express = require('express');
const {exec} = require("child_process");
const Services = require("../syncmethods/services");
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  let data = {};
  res.render('apache2', { title: 'Apache2 | NSM', header: 'Apache2', username: res.locals.username, userpermissions: res.locals.permissions, data: data});
});

module.exports = router;
