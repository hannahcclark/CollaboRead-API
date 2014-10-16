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

function reportError(status, error, response) {
    console.log(error)
    response.status(status).end()
    response.send()
}

app.get('/users', function(req, res) {
    db.collection("users", function(err, userCollection) {

        var userQuery = validator.escape(req.query.id)

        if (!userQuery) {
            userCollection.find({}).toArray(function(err, userResults) {
                res.send(userResults)
            })

        } else {
            userCollection.findOne({"userID":userQuery}, function(err, userID) {
                if (err) {
                    reportError(404, err, res)
                } else {
                    res.send(userID)
                }
            })
        }
    })
})

app.get('/lecturers', function(req, res) {
    db.collection("users", function(err, userCollection) {

        var lecturerQuery = validator.escape(req.query.id)

        if (!lecturerQuery) {
            userCollection.find({"type":"lecturer"}).toArray(function(err, lecturerResults) {
                res.send(lecturerResults)
            })

        } else {
            userCollection.findOne({"type":"lecturer", "userID":lecturerQuery}, function(err, userID) {
                if (err) {
                    reportError(404, error, res)
                } else {
                    res.send(userID)
                }
            })
        }
    })
})

app.get('/casesets', function(req, res) {
    var setID = validator.escape(req.query.id)
    var lecturerID = validator.escape(req.query.lecturerID)

    db.collection("caseSets", function(err, caseSetsCollection) {
        if (err) {
            reportError(404, err, res)
        } else {
            if (setID) {
                caseSetsCollection.findOne({"setID": setID}, function(err, caseSet) {
                    if (err) {
                        reportError(404, err, res)
                    } else {
                        res.send(caseSet)
                    }
                })
            } else if (lecturerID) {
                caseSetsCollection.find({"owners": lecturerID}).toArray(function(err, caseSets) {
                    if (err) {
                        reportError(404, err, res)
                    } else {
                        res.send(caseSets)
                    }
                })
            } else {
                reportError(404, err, res)
            }
        }
    })
})

app.listen(app.get('port'), function() {
    console.log("running on localhost:"+app.get('port'))
})
