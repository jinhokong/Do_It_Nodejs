/*console.log('hello');
console.log('this is number. %d',10);
console.log('this is string. %s','hi');
var person ={
    name:'hong',
    age:20
};
console.log('this is javascript object. %j',person);
console.dir(person);*/

console.time('duration_time');
var result =0;
for (var i=0; i<10000;i++){
        result += i;
    }
console.timeEnd('duration_time');
console.log('file name : %s',__filename);
console.log('path : %s',__dirname);
