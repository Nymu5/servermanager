const fs = require("fs");
const General = require("./general");
const {subMapper, mapper} = require("./general");
const {response} = require("express");

exports.getConfig = function(fn) {
    General.getFile('/etc/apache2/apache2.conf', 'utf8', function(response){
        response.data = subMapper(mapper(response.data));
        fn(response);
    })
}