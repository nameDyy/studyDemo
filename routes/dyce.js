var express = require('express');
var router = express.Router();
var add = require("./add.js");
var assert  = require("assert");

// http://localhost:3005/dyce/text
router.get('/text', function(req, res) {
    // res.send("222");
    // console.log(add(1));

    // 当2个参数均为整数时
    it("should return 3", function(){
        var sum = add(1, 2);
        assert.equal(sum, 3);
    });
    
    // 当第2个参数为String时
    it("should return undefined", function(){
        var sum = add(1, "2");
        assert.equal(sum, undefined);
    });
    
    // 当只有1个参数时
    it("should return undefined", function(){
        var sum = add(1);
        assert.equal(sum, undefined);
    });
});


module.exports = router;