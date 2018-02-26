var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
    next();
});

router.use('/demo1', require('./demo1/dyce'));
module.exports = router;