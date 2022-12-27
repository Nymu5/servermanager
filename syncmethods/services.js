const { exec } = require("child_process");

exports.mapper = function(error, stdout, stderr, data_processing_function = null){
    if (error) {
        return ({
            status: 500,
            data: `error: ${error.message}`
        })
    }
    if (stderr) {
        return ({
            status: 500,
            data: `stderr: ${stderr}`
        })
    }
    if (!data_processing_function) {
        return ({
            status: 200,
            data: stdout,
        })
    }
    return ({
        status: 200,
        data: data_processing_function(stdout)
    })
}

exports.services_list = function(stdout) {
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

    return service_data;
}

exports.services_list_2 = function(stdout) {
    let lines = stdout.split("\n");
    let services = [];
    for(let i = 1; i < lines.length; i++) {
        if (lines[i] === "") return services;
        if (lines[i].indexOf("not-found inactive dead") === -1) services.push(lines[i].trim().replace(/ +(?= )/g,''));

    }
    return services;
}

exports.services_details = function(stdout) {
    const lines = stdout.split("\n");
    let data = {}
    data["Info"] = lines[0].trim()[1] == " " ? lines[0].trim().slice(2) : lines[0].trim();
    //data["Info"] = lines[0].trim().split(" ")[-1]
    for (let i = 1; i < lines.length; i++) {
        if (lines[i] === '') return data;
        if (lines[i].startsWith("         ")) continue;
        data[lines[i].slice(0,lines[i].indexOf(":")).trim()] = lines[i].slice(lines[i].indexOf(":")+1).trim();
    }
    return data;

    lines.forEach((line, i) => {
        console.log(line)
        if (line.length<1) return data;
        if (!line.startsWith("           ")) {
            if (i == 0) data["Info"] = line.trim();
            else {
                if (line[9] === ":") data[line.slice(0,line.indexOf(":")).trim()] = line.slice(line.indexOf(":")+1).trim();
            }
        }


    })
    return data;
}
