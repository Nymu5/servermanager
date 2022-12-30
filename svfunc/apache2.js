const Apache2 = require("../syncmethods/apache2")
const {subMapper, mapper} = require("../syncmethods/general");
const fs = require("fs");
const {getConfig} = require("../syncmethods/apache2");

exports.config = async (req = null, res = null, next = null) => {
    getConfig((data) => {
        return res.status(data.success ? 200 : 500).json({
            data,
        })
    })
}