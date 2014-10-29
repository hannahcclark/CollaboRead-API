var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

app.set('port', (process.env.PORT || 5000));

require('./app/routes.js')(app);

app.listen(app.get('port'), function() {
    console.log("running on localhost:"+app.get('port'));
});
