console.log('number of argv attributes parameter:'+process.argv.length);
console.dir(process.argv);

process.argv.forEach(function(item,index) {
    console.log(index+' : '+item);
    
});