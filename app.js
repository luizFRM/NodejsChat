var express = require('express');

var app = express();
var PORT = 5000;

server = app.listen(PORT, function(){
    console.log('servidor rodando na porta ' + PORT);
});

require('./sockets/messages');
 
