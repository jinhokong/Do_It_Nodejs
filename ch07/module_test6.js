var require= function(path){
    var exports={};
        exports.getUser= function(){
            return{id:'test01',name:'kong'};
        };
        exports.group={id:'group01',name:'friend'};
    
    return exports;
}

var user=require('....');
function showUser(){
    return user.getUser().name+', '+user.group.name;
}
console.log('사용자 정보:'+showUser());

var a = [1,2,3,4,5];
var b = a.forEach( function(v, i){ console.log(v); return v+1;});
var c = a.map( function(v, i){ console.log(v); return v+1;});
console.log(typeof(b));