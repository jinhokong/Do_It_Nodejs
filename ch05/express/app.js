var express=require('express');
var http=require('http');

var app=express();
app.set('port',process.env.PORT||3000);
app.use(function(req,res,next){
    console.log('첫번째 미들웨어 호출됨');

    req.user='kong';
    next();
});

app.use(function(req,res,next){
    console.log('두번째 미들웨어 호출됨.');
   // res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
   // res.send('서버에서 응답한 결과입니다'+req.user);
   var person={name:'test',age:20};
   //res.send(person)

    var personStr=JSON.stringify(person);
    //res.send(personStr);
    res.writeHead(200,{"Content-Type":"application/json"});
    res.write(personStr);
    res.end();
});
var server=http.createServer(app).listen(app.get('port'),function(){
    console.log('익스프레스로 웹서버를 실행함:'+app.get('port'));
});