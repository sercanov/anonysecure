var anonysecure = require('anonysecure').clientSide;

// Generate a header object.
var myHeader = anonysecure('GET', 'thisisapassphrase');

// Include header in request.
fetch('http://localhost:8080/Login', myHeader).then(function(response) {

    if (response.ok)
        alert('Shall we?');
    else if (response.status == '403')
        alert('You sneaky bastard!');

}).catch(function(err) {

});