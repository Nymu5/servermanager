const { array_concat, path_concat, sortObject, command} = require("./general");

function lslMapper(output, args = null) {
    let oArray = output.split("\n").filter(l => l != "");
    let data = {};
    for (let i = 0; i < oArray.length; i++) {
        let pline = oArray[i].removeSpaces().split(" ");
        if (pline.length < 9) continue;
        let path = array_concat(pline, 8, pline.length-1);
        let fpath = args.toString().split("/").filter(f => f.trim() !== "");
        let spath = args.toString().split("/").filter(f => f.trim() !== "");
        let rspath = null;
        let sspath = null;
        if (pline[0].startsWith("l")) {
            rspath = pline[0].startsWith("l") ? path.split("->").reverse()[0].trim() : null;
            sspath = rspath.split("/").filter(f => f.toString().trim() !== "");
            for (let i = 0; i < sspath.length; i++) {
                switch (sspath[i]) {
                    case ".":
                        continue;
                    case "..":
                        spath.pop();
                        continue;
                    default:
                        spath.push(sspath[i]);
                        break;
                }
            }
        }
        let name = path.split("->")[0].trim().split("/").reverse()[0];
        let aspath = pline[0].startsWith("l") ? path_concat(spath) : null;
        fpath.push(name);
        let afpath = path_concat(fpath);
        data[path] = {
            name,
            type: (pline[0].startsWith("d") ? "directory" : (pline[0].startsWith("l") ? "symlink" : "file")),
            rspath,
            aspath,
            afpath,
            permissions: pline[0],
        }
        data = sortObject(data, "type");
    }
    return data;
}

function isFile(path, fn) {
    command(`file ${path}`, (data) => {
        fn(data, data.data.type === "file");
    }, (data) => {
        let res = {};
        res.output = data;
        if (data.toString().indexOf("(No such file or directory)") !== -1) res.type = "not found";
        else if (data.toString().indexOf(": directory") !== -1) res.type = "directory";
        else if (data.toString().indexOf(": symbolic link") !== -1) res.type = "symbolic link";
        else res.type = "file";
        return res;
    }, path)
}


module.exports = { lslMapper, isFile }