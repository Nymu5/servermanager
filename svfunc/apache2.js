const Apache2 = require("../syncmethods/apache2")
const {subMapper, mapper} = require("../syncmethods/general");

exports.config = async (req, res, next) => {
    fs.readFile('/etc/apache2/apache2.conf', 'utf8', function (err, data) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
                data: err,
            })
        }
        data = subMapper(mapper(data));
        return res.status(200).json({
            success: true,
            message: "Fetched file successfully",
            data
        });
    })
}

exports.subFunction