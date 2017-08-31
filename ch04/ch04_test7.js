var fs=require('fs');
fs.writeFile('./output.txt','Hello',function(err){
    if(err){
        console.log('error');
        console.dir(err);
        return;
    }
    console.log('output.txt!!');
});