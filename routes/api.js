const express = require("express");
const router = express.Router();

router.use('/auth', require("../auth/route"));

module.exports = router;
