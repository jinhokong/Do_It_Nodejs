var express=require('express');
var http=require('http');
var statics=require('serve-static');
var path=require('path');

var bodyparser=require('body-parser');
var app=express();


app.set('port',process.env.PORT||3000);

app.use(statics(path.join(__dirname,'public')));

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());


app.use(function(req,res,next){
    console.log('첫번째 미들웨어 호출됨');
    var userAgent=req.header('User-Agent');
    var paramName=req.body.name||req.query.name;
    res.send('<h3>서버에서 응답:+userAgent ->'+userAgent+
    '</h3>  <h3> param name->'+paramName+'</h3>' );
});

var server=http.createServer(app).listen(app.get('port'),function(){
    console.log('익스프레스로 웹서버를 실행함:'+app.get('port'));
});