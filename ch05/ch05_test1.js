var http=require('http');

var server=http.createServer();
var port=3000;
var host='192.168.0.20';
server.listen(port,host,'50000',function(){
    console.log('웹서버가 실행되었습니다.'+host+':'+port);
})