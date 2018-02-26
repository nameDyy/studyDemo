const { sum, minus } = require('../demo1/sum.js')

test('测试1+2=3', () => {
    expect(sum(1, 2)).toBe(3);
})

test('测试2-1=1', () => {
    expect(minus(2, 1)).toBe(1);
})
