```javascript
npm install anonysecure --save
```

# anonysecure
Anonymous authorization for JS applications

## What is it?
It authorizes the connection between your client and server endpoints without any login providers.

## How it works?
Client sends the request with a token, which is simply an encrypted timestamp. 

When server gets the request, the module decrypts token with passphrase -which is used in the client- if decyrption succesful and timestamp is not timed out, it passes request to handler. 

If decyrption fails -which means passphrase is wrong- or timestamp timed out, bang. 403.

## When to use?
It should be used when your application have no login / auth systems. It's like an anonymous authorization system. Yes, like the name.

## How to use ?

anonysecure has two parts, first one for the server, other one is for the client side which is optional.
Server side is eligible with restify right now, but you get the idea so you can port it to other frameworks too.

**Options object**
* PASSPHRASE : It's a secret string for to decrypt incoming authorization token. It must be same with the one on the client side.
* excludeMethods : If you want to exclude any HTTP methods from the authorization process, use this prop.
* excludeURLs : If you want to exclude any server routes from the authorization process, use this prop. Commonly used with Signup and Login routes.
* timeout : It's a timeout treshold in seconds. That means when client sends the request with a timestamp, server checks it and if it's in the specified timeout, returns OK, if not. Bang. 403.

**Server**
```javascript
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
```
The code above creates restify server and executes anonysecure *with options* before route handler. See [restify docs](http://restify.com/#common-handlers-serveruse) docs for more.

```javascript    
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
```
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
    
**TODO**
* hapijs integration
* ?
