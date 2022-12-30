const { exec } = require("child_process");

function status_mapper(textstatus) {
    switch (textstatus) {
        case "active": return 1;
        case "inactive": return 0;
        case "failed": return -1;
        default: return -2;
    }
}

function array_concat(array, start, end) {
    let concat = "";
    for (let i = start; i <= end; i++) {
        concat += i == end ? array[i] : array[i]+" ";
    }
    return concat;
}

exports.array_move = function(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};

exports.mapper = function(error, stdout, stderr, data_processing_function = null){
    if (error && error.code != 3) {
        //console.log(error)
        //console.log(stdout)
        //console.log(stderr)
        return ({
            status: 500,
            data: `error: ${error.message}`
        })
    }
    if (stderr) {
        //console.log(error)
        //console.log(stdout)
        //console.log(stderr)
        return ({
            status: 500,
            data: `stderr: ${JSON.stringify(stderr)}`
        })
    }
    if (!data_processing_function) {
        //console.log(error)
        //console.log(stdout)
        //console.log(stderr)
        return ({
            status: 200,
            data: stdout,
        })
    }
    //console.log(error)
    //console.log(stdout)
    //console.log(stderr)
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
    let services_data = {};
    for(let i = 1; i < lines.length; i++) {
        if (lines[i] === "") return services_data;
        let line = "";
        if (lines[i].indexOf("not-found inactive dead") === -1) {
            line = (lines[i].indexOf("\u25CF") !== -1) ? (lines[i].slice(lines[i].indexOf("\u25CF")+1).trim().replace(/ +(?= )/g,'')) : (lines[i].trim().replace(/ +(?= )/g,''));
        } else continue;
        let split = line.split(" ");
        services_data[split[0]] = {
            loaded: split[1] === "loaded",
            status: status_mapper(split[2]),
            sub: split[3],
            description: array_concat(split, 4, split.length-1),
        }
    }
    return services_data;
}

exports.services_details = function(stdout) {
    const lines = stdout.split("\n");
    let data = {}
    data["Info"] = (lines[0].indexOf("\u25CF") !== -1) ? lines[0].slice(lines[0].indexOf("\u25CF")+1).trim() : lines[0].trim();
    //data["Info"] = lines[0].trim().split(" ")[-1]
    for (let i = 1; i < lines.length; i++) {
        if (lines[i] === '') return data;
        if (lines[i].startsWith("         ")) continue;
        data[lines[i].slice(0,lines[i].indexOf(":")).trim()] = lines[i].slice(lines[i].indexOf(":")+1).trim();
    }
    return data;
}
