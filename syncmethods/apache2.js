const fs = require("fs");
const General = require("./general");

exports.getConfig = function() {
    let file = General.getFile('/etc/apache2/apache2.conf')
    console.log(file);
}