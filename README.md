# anonysecure
Anonymous authorization for JS applications

## What is it?
It authorizes the connection between your client and server endpoints without any login providers.

## When to use?
It should be used when your application have no login / auth systems. It's like an anonymous authorization system. Yes, like the name.

## How to use ?
anonysecure has two parts, first one for the server, other one is for the client side which is optional.
Server side is eligible with restify right now, but you get the idea so you can use it on other frameworks too.

**Server**

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

        // Initialize anonysecure
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

**Client**

    var anonysecure = require('anonysecure').clientSide;
    
    // This generates a header object.
    var myHeader = anonysecure('GET', 'thisisapassphrase');
    
    // Include header in request and sent it.
    fetch('http://localhost:8080/Login', myHeader).then(function(response) {
    
        if (response.ok)
            alert('Shall we?');
        else if (response.status == '403')
            alert('You sneaky bastard!');
    
    });