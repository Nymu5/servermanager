var express = require('express');
const {command, rowsToList, sortObject} = require("../syncmethods/general");
const {lslMapper} = require("../syncmethods/filesystem");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let path = req.query.path;
  if (!path) path = "/"
  command(`ls -l ${path}`, (data) => {
    data.path = path;
    console.log(data)
    res.render('filesystem', { title: 'FileSystem | NSM', header: 'FileSystem', username: res.locals.username, userpermissions: res.locals.permissions, data: data});
  }, lslMapper, path)
});

module.exports = router;
