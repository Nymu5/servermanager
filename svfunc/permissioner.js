const services_req = require("./services");

exports.permissioner = async (req, res, next) => {
    const services = Object.keys(services_req);
    let permission_name = "";
    let split_url = res.locals.url.split("/");
    for (let i = split_url.indexOf("api")+1; i < split_url.length; i++) {
        permission_name += split_url[i] + (i === split_url.length-1 ? "" : "_");
    }

    if (res.locals.permissions["admin"] !== true && (res.locals.permissions[permission_name] !== true)) {
        return res.status(403).json({
            message: "Missing permissions - please contact admin!"
        })
    }
    next();
}