const express = require("express");
const router = express.Router();

router.use('/auth', require("../auth/route"));
router.use('/services', require("../svfunc/route"));

module.exports = router;
