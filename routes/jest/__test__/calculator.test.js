var calc = require('../demo1/calculator');

test('测试1+2=3', () => {
    expect(calc.sum(1, 2)).toBe(3);
})

test('测试2-1=1', () => {
    expect(calc.minus(2, 1)).toBe(1);
})