var StaticServer = require('static-server');

var server = new StaticServer({
    rootPath:'./dist/',
    port:8000
});

server.start(function(){
    console.log('this server is ready and its port is : ',server.port);
})