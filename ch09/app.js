/**
 * ejs 뷰 템플릿 적용하기
 * 
 * 뷰 템플릿을 만들고 응답 웹문서를 템플릿으로부터 생성
 *
 * @date 2016-11-10
 * @author Mike
 */
 

// Express 기본 모듈 불러오기
var express = require('express')
  , http = require('http')
  , path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , static = require('serve-static')
  , errorHandler = require('errorhandler');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// Session 미들웨어 불러오기
var expressSession = require('express-session');
  

// 모듈로 분리한 설정 파일 불러오기
var config = require('./config');

// 모듈로 분리한 데이터베이스 파일 불러오기
var database = require('./database/database');

// 모듈로 분리한 라우팅 파일 불러오기
var route_loader = require('./routes/route_loader');

//passport 사용
var passport =require('passport');
var flash=require('connect-flash');


//암호화 모듈
var crypto = require('crypto')
 


// 익스프레스 객체 생성
var app = express();


//===== 뷰 엔진 설정 =====//
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
console.log('뷰 엔진이 pug로 설정되었습니다.');


//===== 서버 변수 설정 및 static으로 public 폴더 설정  =====//
console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || 3000);
 

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));
 
// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));

//passport init

app.use(passport.initalize());
app.use(passport.session());
app.use(flash());

//passport strategy 설정
var localStrategy=require('passport-local').Strategy;
passport.use('local-login',new localStrategy({
	usernameField:'email',
	passwordField:'password',
	passReqToCallback:true
},function(req,email,password,done){
	console.log('passport의 local-login 호출됨:'+email+','+password);
	var database=app.get('database');
	database.UserModel.findOne({'email':email},function(err,user){
		if(err){
			console.log('error!!')
			return done(err);
		}
		if(!user){
			console.log('사용자 아이디가 일치하지 않습니다.');
			return done(null,false,req.flash('loginMessage','등록된 계정이 없습니다.'))
		}
		var authenticated =user.authenticate(password,user._doc.salt,user._doc.hasged_password)
		if(!authenticated){
			console.log('비밀번호가 일치하지 않습니다.')
			return done(null,false,req.flash('loginMessage','비밀번호가 일치하지 않습니다.'))

		}
		console.log('아이디와 비밀번호가 일치합니다.');
		return done(null,user);
	})
}));

passport.use('local-signup',new localStrategy({
	usernameField:'email',
	passwordField:'password',
	passReqToCallback:true
},function(req,email,password,done){
	var paramName=req.body.name||req.query.name;
	console.log('passport의 local-signup 호출됨:'+email+','+password);
	var database=app.get('database');
	database.UserModel.findOne({'email':email},function(err,user){
		if (err){
			console.log('error!!!!!')
			return done(err);
		}
		if(user){
			console.log('기존에 계정이 있습니다');
			return done(null,false,req.flash('signupMessage','계정이있습니다'))

		}
		else{
			var user= new database.UserModel({'email':email,'password':password,'name':paramName});
			user.save(function(err){
				if(err){
					console.log('데이터베이스에 저장시 에러.')
					return done(null,false,req.flash('signupMessage','사용자 정보 저장시 에러가 발생했습니다.'))
				}
				console.log('사용자 데이터 저장함');
				return done(null,user);
			})
		}
	})
}
));


passport.serializeUser(function(user,done){
	console.log('serializeUser 호출됨,');
	console.dir(user);
	done(null,user);
})
passport.deserializeUser(function(user,done){
	console.log('deserializeUser호출됨');
	console.dir(user);
	done(null,user);
})
//라우팅 정보를 읽어들여 라우팅 설정
route_loader.init(app, express.Router());




//===== 404 에러 페이지 처리 =====//
var errorHandler = expressErrorHandler({
 static: {
   '404': './public/404.html'
 }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );


//===== 서버 시작 =====//

//확인되지 않은 예외 처리 - 서버 프로세스 종료하지 않고 유지함
process.on('uncaughtException', function (err) {
	console.log('uncaughtException 발생함 : ' + err);
	console.log('서버 프로세스 종료하지 않고 유지함.');
	
	console.log(err.stack);
});

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
	if (database.db) {
		database.db.close();
	}
});

// 시작된 서버 객체를 리턴받도록 합니다. 
var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

	// 데이터베이스 초기화
	database.init(app, config);
   
});
