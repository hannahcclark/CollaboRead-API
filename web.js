var express = require('express')
var app = express()
var validator = require('validator')

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

app.get('/lecturercases', function(req, res) {
    var lecturerID = validator.escape(req.query.lecturerID)
    db.collection("users", function(err, usersCollection) {
        usersCollection.findOne({"id_num": lecturerID}, function(err, user) {
            if (err || user["type"] != "lecturer") {
                console.log(err)
                res.status(404).end()
                res.send()
            } else {
                db.collection("caseSets", function(err, caseSetsCollection) {
                    if (err) {
                        console.log(err)
                        res.status(404).end()
                        res.send()
                    } else {
                        caseSetsCollection.find({"caseSet_id": {$in:user["caseSets"]} }).toArray(function(err, caseSet) {
                            if (err) {
                                console.log(err)
                                res.status(404).end()
                                res.send()
                            } else {
                                res.send(caseSet)
                            }
                        })
                    }
                })
            }
        })
    })
})

app.listen(app.get('port'), function() {
    console.log("running on localhost:"+app.get('port'))
})
