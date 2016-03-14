var anonysecure = require('anonysecure').serverSide;
var restify = require('restify');

// CREATE SERVER //
var server = restify.createServer();
server.use(restify.authorizationParser());

server.use(function(req,res,next){
    // Options object
    var options = {
        "PASSPHRASE": "thisisapassphrase",
        "excludeMethods": ['POST'],
        "excludeURLs":['/Login'],
        "timeout":60
    };

    anonysecure(req,res,next,options);
});

// This is not excluded, will throw 403.
server.get('/Ping',
    function handlePing(req, res) {
        res.send("OK");
    });

// This is excluded in URLs, will be OK to any request.
server.get('/Login',
    function handleLogin(req, res) {
        res.send("OK");
    });

// This is excluded by method type (POST), will be OK to any request.
server.post('/A',
    function handleA(req, res) {
        res.send("OK");
    });

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});