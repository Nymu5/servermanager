var express = require('express');
const {exec} = require("child_process");
const Services = require("../syncmethods/services");
const { config } = require("../svfunc/apache2");
const {getConfig} = require("../syncmethods/apache2");
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  getConfig((data) => {
    res.render('apache2', { title: 'Apache2 | NSM', header: 'Apache2', username: res.locals.username, userpermissions: res.locals.permissions, data: data});
  })
});

module.exports = router;
