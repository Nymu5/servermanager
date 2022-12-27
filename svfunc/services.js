const { exec } = require("child_process");
const { services_list, run} = require("../syncmethods/services");
const Services = require("../syncmethods/services");


exports.list = async (req, res, next) => {
    exec("systemctl -r --type service --all", (error, stdout, stderr) => {
        const output = Services.mapper(error, stdout, stderr, Services.services_list_2)
        return res.status(output.status).json({ data: output.data })
    });
    //exec("service --status-all", (error, stdout, stderr) => {
    //    const output = Services.mapper(error, stdout, stderr, Services.services_list)
    //    return res.status(output.status).json({ data: output.data })
    //});

}

exports.details = async (req, res, next) => {
    let service = req.query.service;
    if (!service) {
        return res.status(400).json({
            message: "No service specified"
        })
    }
    exec(`sudo systemctl -r status ${service}`, (error, stdout, stderr) => {
        const output = Services.mapper(error, stdout, stderr, Services.services_details);
        return res.status(output.status).json({ data: output.data })
    })
}