const { exec } = require("child_process");

exports.list = async (req, res, next) => {
    exec("service --status-all", (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({
                message: `error: ${error.message}`
            })
        }
        if (stderr) {
            return res.status(500).json({
                message: `stderr: ${stderr}`
            })
        }
        let service_data_array = [];
        stdout.split(" ").forEach((part) => {
            if (part != "" && part != "[" && part != "]") {
                if (part.length == 1) service_data_array.push(part);
                else service_data_array.push(part.slice(0, part.length-1));
            }
        })
        let service_data = {};

        for(let i = 1; i < service_data_array.length; i+=2) {
            service_data[service_data_array[i]] = service_data_array[i-1] == "+";
        }


        return res.status(200).json({
            services: service_data
        })


        console.log(`stdout: ${stdout}`);
    });
}
