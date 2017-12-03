
var myIpt = $$('#ipt')
var myIpt2 = $('#ipt')
var mySpan = $$('#myspan')
// myIpt.val('3333').setColor('#0f0').consoleVal()

myIpt.addEventHander('change',function(){
    alert(this.value)
})

// $$('#btn').click(function(){
//     alert('111')
// })


$('#btn').on('click',function(){
    alert('111')
})

// var span = $('<div><span>22133</span></div><div><span>22133</span></div>')
// $('#mydiv').append(span)

// var span1 = document.createElement('span')
// span1.innerText = '33333'
// span1.setAttribute('ID','myspan1')
// document.querySelector('#mydiv').appendChild(span1)

// document.querySelector('#mydiv').innerHTML = '<div><span>22133</span></div><div><span>22133</span></div>'

// $$('#mydiv').append('<div><span>2222</span></div><div><span>2222</span></div>')

var dom = $('<div><span>2222</span></div><div><span>2222</span></div>')

$$('#mydiv').append(dom[0])
$$('#mydiv').prepend(dom[0])