var fs=require('fs');
fs.open('./output.txt','w',function(err,fd){
    if(err){
        console.log('error');
        console.dir(err);
        return;
    }
    var buf=new Buffer('안녕');
    fs.write(fd,buf,0,buf.length,null,function(err,written,buffer){
        if(err){
            console.log('write error');
            console.dir(err);
            return;
        }
        console.log('complite');
        fs.close(fd,function(){
            console.log('file close');
        })
    })
})