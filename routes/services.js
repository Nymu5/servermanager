var express = require('express');
const {exec} = require("child_process");
const Services = require("../syncmethods/services");
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  let service = req.query.service;
  if (service) {
    exec(`sudo systemctl -r status ${service}`, (error, stdout, stderr) => {
      const data = Services.mapper(error, stdout, stderr, Services.services_details);
      data.details = true;
      data.service = service;
      res.render('services', { title: 'Services | NSM', header: 'Services', username: res.locals.username, userpermissions: res.locals.permissions, data: data});
    })
  } else {
    exec("systemctl -r --type service --all", (error, stdout, stderr) => {
      let data = Services.mapper(error, stdout, stderr, Services.services_list_2);
      data.details = false;
      res.render('services', { title: 'Services | NSM', header: 'Services', username: res.locals.username, userpermissions: res.locals.permissions, data: data});
    });
  }
});

module.exports = router;
