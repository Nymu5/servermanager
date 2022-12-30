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

const locked = ['apache2.service', 'ssh.service'];

exports.stop = async (req, res, next) => {
    const { service } = req.body;
    if (!service || !service.endsWith(".service")) {
        return res.status(503).json({
            data: "error: no service specified or not ending with .service."
        })
    }
    if (locked.indexOf(service) !== -1) {
        return res.status(423).json({
            message: "error: Locked processes cannot be stopped."
        })
    }
    exec(`systemctl stop ${service}`, (error, stdout, stderr) => {
        const output = Services.mapper(error, stdout, stderr, Services.services_list_2)
        return res.status(output.status).json({ data: output.data })
    });
}

exports.start = async (req, res, next) => {
    const { service } = req.body;

    if (!service || !service.endsWith(".service")) {
        return res.status(503).json({
            data: "error: no service specified or not ending with .service."
        })
    }
    exec(`systemctl start ${service}`, (error, stdout, stderr) => {
        const output = Services.mapper(error, stdout, stderr, Services.services_list_2)
        console.log(output.status);
        return res.status(output.status).json({ data: output.data })
    });
}

exports.restart = async (req, res, next) => {
    const { service } = req.body;
    if (!service || !service.endsWith(".service")) {
        return res.status(503).json({
            data: "error: no service specified or not ending with .service."
        })
    }
    exec(`systemctl restart ${service}`, (error, stdout, stderr) => {
        const output = Services.mapper(error, stdout, stderr, Services.services_list_2)
        console.log(output.status);
        return res.status(output.status).json({ data: output.data })
    });
}

exports.journal = async (req, res, next) => {
    let service = req.query.service;
    let lines = req.query.lines || 3;
    let reverse = req.query.reverse !== "false";
    console.log(req.query.reverse)

    exec(`journalctl${service ? " -u " + service : ""} -n ${lines}`, (error, stdout, stderr) => {
        let lines = stdout.split("\n");
        if (reverse) {
            lines = lines.reverse();
            lines = Services.array_move(lines, lines.length-1, 0);
        } else {
            lines.push("");
            lines = Services.array_move(lines, lines.length-1, 1);
        }
        const output = Services.mapper(error, lines, stderr)
        return res.status(output.status).json({ data: output.data })
    });
}