var anonysecure = require('./index.js').serverSide;
var restify = require('restify');

// CREATE SERVER //
var server = restify.createServer();
server.use(restify.bodyParser());
server.use(restify.queryParser());
server.use(restify.authorizationParser());

server.use(function(req,res,next){
    // Options object
    var options = {
        "PASSPHRASE": "thisisapassphrase",
        "excludeMethods": ['POST'],
        "excludeURLs":['/Login'],
        "timeout":60
    };

    anonysecure(req,res,next,options); });

server.get('/Ping',
    function sendInfo(req, res) {
        res.send("OK");
    });

server.get('/Login',
    function sendInfo(req, res) {
        res.send("OK");
    });

server.post('/A',
    function sendInfo(req, res) {
        res.send("OK");
    });

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});