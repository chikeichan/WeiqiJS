var app     = require('./server/server.js');
var port    = process.env.PORT || 8080;
var io      = require('socket.io').listen(app.listen(port));
var socket  = require('./server/socket.js')(io);

console.log('App listening at ', port);
