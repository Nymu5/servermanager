const { command, rowsToList } = require('../syncmethods/general')
const { lslMapper, isFile } = require("../syncmethods/filesystem");

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

exports.isfile = async (req, res, status) => {
    let path = req.query.path;
    if (!path) path = "/";
    isFile(path, (data, isFile) => {
        return res.status(200).json({
            data,
            isFile,
        })
    })
}