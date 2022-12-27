var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  let testdata = {
    "service1": true,
    "service2": true,
    "service3": false,
    "service4": true,
    "service5": true,
    "service6": false,
    "service7": false,
    "service8": true,

  }
  let testdata2 = null;
  let service = req.query.service;
  if (service) {
    testdata2 = {
      service,
      "data": {
        "Info": "● apache2.service - The Apache HTTP Server",
        "Loaded": "loaded (/lib/systemd/system/apache2.service; enabled; vendor preset: enabled)",
        "Active": "active (running) since Mon 2022-12-26 21:32:52 CET; 16h ago",
        "Docs": "https://httpd.apache.org/docs/2.4/",
        "Process": "468 ExecReload=/usr/sbin/apachectl graceful (code=exited, status=0/SUCCESS)",
        "Main PID": "26082 (apache2)",
        "Tasks": "10 (limit: 4915)",
        "Memory": "52.9M",
        "CGroup": "/system.slice/apache2.service"
      }
    }
    //testdata2.data = {}
  }

  res.render('services', { title: 'Services | NSM', header: 'Services', username: res.locals.username, userpermissions: res.locals.permissions, data: testdata, data2: testdata2 });
});

module.exports = router;
