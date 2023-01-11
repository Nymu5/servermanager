var express = require('express');
const {command, rowsToList, sortObject, path_concat} = require("../syncmethods/general");
const {lslMapper, isFile} = require("../syncmethods/filesystem");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let path = req.query.path;
  if (!path) path = "/"
  isFile(path, (data, isFile) => {
    command(`ls -l ${path}`, (data) => {
      data.path = path;
      data.isFile = isFile;
      let bpath = path.split("/").filter(f => f !=="");
      bpath.pop();
      data.bpath = path_concat(bpath);
      console.log(data)
      res.render('filesystem', { title: 'FileSystem | NSM', header: 'FileSystem', username: res.locals.username, userpermissions: res.locals.permissions, data: data});
    }, lslMapper, path)
  })
});

module.exports = router;
