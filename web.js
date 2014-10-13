var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))

var mongoURI = process.env.MONGOLAB_URI

var mongo = require('mongodb')
var db = mongo.Db.connect(mongoURI, function(error, dbConnection) {
    if (error) {
        console.log(error)
    } else {
        db = dbConnection
    }
})

app.get('/users', function(req, res) {
    db.collection("users", function(err, collection) {
        collection.find({}).toArray(function(err, documents) {
            res.send(documents)
        })
    })
})

app.get('/lecturers', function(req, res) {
    db.collection("users", function(err, collection) {
        collection.find({"type":"lecturer"}).toArray(function(err, documents) {
            res.send(documents)
        })
    })
})

app.listen(app.get('port'), function() {
    console.log("running on localhost:"+app.get('port'))
})
