const { command, rowsToList } = require('../syncmethods/general')
const {lslMapper} = require("../syncmethods/filesystem");

exports.view = async (req, res, next) => {
    let path = req.query.path;
    if (!path) path = "/"
    command(`ls -l ${path}`, (data) => {
        console.log(data);
        return res.status(data.status).json({
            path,
            files: data.data,
        })
    }, lslMapper, path)
}