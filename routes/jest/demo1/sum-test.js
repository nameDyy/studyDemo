var express = require('express');
var router = express.Router();
var sum=require('./sum');

// http://localhost:3005/jest/demo1
router.get('/', function (req, res) {
    test('adds 1 + 2 to equal 3', ()=> {
        expect(sum(1, 2)).toBe(3);
    });
});

module.exports = router;