var express = require('express');
var router = express.Router();


function add(a, b){
    if (typeof a === "number" && typeof b === "number"){
        return a + b;
    }
    else{
        return undefined;
    }
 
}

module.exports =new  add();