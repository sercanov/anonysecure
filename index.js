var errors = require('restify-errors');
var CryptoJS = require('crypto-js');

//var options = {
//    "PASSPHRASE": "thisisapassphrase",
//    "excludeMethods": ['POST'],
//    "excludeURLs":['Ping','Login'],
//    "timeout":60
//};

module.exports = {
    serverSide : function(req, res, next, options){
        console.log(options);
        if (!options || !options.PASSPHRASE)
            return 'Check your options or passphrase';

        var checkMethods = function () {
            if (options.excludeMethods && options.excludeMethods.length > 0)
                if (options.excludeMethods.indexOf(req.method) > -1) // Check if method in excluded HTTP methods
                    next();
                else checkUrl();
            else checkUrl();
        };

        var checkUrl = function () {
            if (options.excludeURLs && options.excludeURLs.length > 0)
                if (options.excludeURLs.indexOf(req.url) > -1) // Check if URL in excluded HTTP URLs
                    next();
                else checkAuth();
            else checkAuth();
        };

        var checkAuth = function () {
            var timeout = (options.timeout) ? parseInt(options.timeout) : 60;

            var authHeader = req.authorization.credentials;

            // No Auth Token
            if (!authHeader)
                next(new errors.NotAuthorizedError());
            else {
                var decrypted = CryptoJS.TripleDES.decrypt(authHeader, options.PASSPHRASE).toString(CryptoJS.enc.Utf8);

                if (!decrypted || decrypted === null) // Wrong PASSPHRASE
                    next(new errors.NotAuthorizedError());
                else {
                    var requestDate = new Date(parseInt(decrypted));
                    var dateDiff = (requestDate - new Date()) / 1000; // Convert milliseconds to seconds.
                    if (dateDiff > timeout) // Auth timed-out.
                        next(new errors.NotAuthorizedError());
                    else { // Auth is fresh. Go on.
                        next();
                    }
                }
            }
        };

        checkMethods();
    },
    clientSide: function(method, passphrase){

        var msTime = new Date().getTime().toString();
        var encryptedTime = CryptoJS.TripleDES.encrypt(msTime, passphrase);

        return {
            method: method,
            headers: {
                Authorization: 'Bearer ' + encryptedTime.toString()
            }
        };
    }
};
