const {removeSpaces} = require("./general");
const fs = require("fs");
const {exec} = require("child_process");
const Services = require("./services");

function mapper(data) {
    data = data.toString().split("\n");
    let array = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].startsWith("#") || data[i].length == 0) continue;
        array.push(data[i]);
    }
    return array;
}

function subMapper (sub, args = null) {
    if (sub[0].toString().match(/.*<.*>.*/g) && sub[sub.length-1].toString().match(/.*<.*>.*/g)) {
        let key = sub[0].toString().replace("<", "").replace(">", "").trim().split(" ")[0];
        let endRegExp = new RegExp(".*" + key + ".*", "g");
        if (!sub[sub.length-1].toString().match(endRegExp)) {
            return null;
        }
    }

    let data = {};
    if (args) data["**args"] = args;

    for (let i = 1; i < sub.length-1; i++) {
        if (!sub[i].toString().match(/.*<.*>.*/g)) {
            let newKey = sub[i].removeSpaces().trim().split(/ /g)[0];
            if (Object.keys(data).indexOf(newKey) === -1) data[newKey] = [];
            data[newKey].push(sub[i].replace(newKey, "").removeSpaces().trim());
        } else {
            let newSub = [];
            let newKey = sub[i].toString().replace("<", "").replace(">", "").trim().split(" ")[0];
            let newKeyArgs = sub[i].replace(newKey, "").replace(/.*</g, "").replace(/>.*/g, "").trim().removeSpaces();

            let regExpEnd = new RegExp(".*<\/.*" + newKey + ".*>.*", "g");
            let closingTag = sub.reIndexOf(regExpEnd, i);
            for (i; i <= closingTag; i++) {
                newSub.push(sub[i])
            }
            if (Object.keys(data).indexOf(newKey) === -1) data[newKey] = [];
            data[newKey].push(subMapper(newSub, newKeyArgs));
            i--;
        }
    }
    return data;
}

async function getFile(path, encoding, fn) {
    fs.readFile(path, encoding, function (err, data) {
        let response;
        if (err) {
            response = {
                success: false,
                message: err.message,
                data: err,
            };
        } else {
            response = {
                success: true,
                message: "Fetched file successfully",
                data
            }
        }
        fn(response);
    })
}

function rowsToList(rowsStr) {
    return rowsStr.split("\n").filter(e => e != "");
}

async function command(command, fn, mapper = null, args = null) {
    exec(command, (error, stdout, stderr) => {
        fn(Services.mapper(error, stdout, stderr, mapper, args));
    });
}

function array_concat(array, start, end) {
    let concat = "";
    for (let i = start; i <= end; i++) {
        concat += i == end ? array[i] : array[i]+" ";
    }
    return concat;
}

function path_concat(array) {
    let concat = "/";
    for (let i = 0; i < array.length; i++) {
        concat += array[i] + (i < array.length-1 ? "/" : "");
    }
    return concat;
}

function sortObject(object, property) {
    let list = [];
    let res = {};
    Object.keys(object).forEach((key) => {
        list.push({
            key,
            val: object[key],
        })
    })
    list.sort((a,b) => a.val[property].localeCompare(b.val[property]));
    list.forEach((item) => {
        res[item.key] = item.val;
    })
    return res;
}

module.exports = { subMapper, mapper, getFile, command, rowsToList, array_concat, path_concat, sortObject }

String.prototype.removeSpaces = function() {
    return this.replace(/ +(?= )/g, '');
}

Array.prototype.reIndexOf = function(rx, start= 0, end = null) {
    for (let i = start; i < (!end || end > this.length ? this.length : end); i++) {
        if (this[i].toString().match(rx)) {
            return i;
        }
    }
    return -1;
}
