var express = require('express');
var http = express();
var httpServer = require('http');
var webSocketServer = require('websocket').server;
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

http.set('port', (process.env.PORT || 5000));

var hs = httpServer.createServer(function(req,res){});
hs.listen(9999,function(){console.log("Websockets on 9999")});

wsServer = new webSocketServer({
    httpServer: hs
});

require('./app/routes.js')(http, wsServer);

http.listen(http.get('port'), function() {
    console.log("running on localhost:"+http.get('port'));
});
