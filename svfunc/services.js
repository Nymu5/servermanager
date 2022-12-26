exports.get = async (req, res, next) => {
    return res.status(200).json({
        message: "works"
    })
}
