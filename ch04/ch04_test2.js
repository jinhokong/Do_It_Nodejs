/*process.on('exit',function(){
    console.log('exit 이벤트 발생');
})
setTimeout(function(){
    console.log('2초후에 실행되었음.');
    process.exit();
},2000);
console.log('2초 후에 실행될것임.');
*/
process.on('tick',function(count){
    console.log('tick 이벤트 실행: '+count);
})
setTimeout(function(){
    console.log('2초후에 실행되었음.');
    process.emit('tick','2');
},2000);