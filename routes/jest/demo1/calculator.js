function Calc() {

}

Calc.prototype.sum = function(a,b){
    return a+b;
}

Calc.prototype.minus = function(a,b){
    return a- b;
}

module.exports = new Calc();