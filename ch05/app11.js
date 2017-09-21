var express=require('express');
var http=require('http');
var statics=require('serve-static');
var path=require('path');
var cookiePaser=require('cookie-parser');
var bodyparser=require('body-parser');
var expressSession=require('express-session');
var app=express();


app.set('port',process.env.PORT||3000);

app.use(statics(path.join(__dirname,'public')));

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.use(cookiePaser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}))

var router=express.Router();

router.route('/process/product').get(function(req,res){
    console.log('/process/product 라우팅 함수 호출됨.');
    if(req.session.user){
        res.redirect('/public/product.html');
    }else{
        res.redirect('public/login2.html');
    }
})

router.route('/process/setUserCookie').get(function(req,res){
    console.log('/porcess/setUserCookie 라우팅 함수 호출');

    res.cookie('user',{
        id:'mike',
        name:'소녀시대',
        authorized:true
    });
    res.redirect('/process/showCookie');
});

router.route('/process/showCookie').get(function(req,res){
    console.log('/process/showCookie 라우팅 함수 호출됨');
    res.send(req.cookies);
});


app.use('/',router);
app.all('*',function(req,res){
    res.status(404).send('요청한 페이지가 없습니다.')
})
var server=http.createServer(app).listen(app.get('port'),function(){
    console.log('익스프레스로 웹서버를 실행함:'+app.get('port'));
});