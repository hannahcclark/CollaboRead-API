var bodyParser = require('body-parser');
var bodyParserURLEncoded = bodyParser.urlencoded({extended: true});

var validator = require('validator');

var mongoURI = process.env.MONGOLAB_URI;
var mongo = require('mongodb');
var db = mongo.Db.connect(mongoURI, function(error, dbConnection) {
    if (error) {
        console.log(error);
    } else {
        db = dbConnection;
    }
});

module.exports = function(app) {

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

    app.post('/submitanswer', bodyParserURLEncoded, function(req, res) {
        var setID = validator.escape(req.body.setID)
        var caseID = validator.escape(req.body.caseID)
        var owners = validator.escape(req.body.owners)
        var answerData = validator.escape(req.body.answerData)

        if (!owners || !answerData) {
            reportError(404, "Missing required parameters", res)
        } else {
            db.collection("caseSets", function(err, caseSetsCollection) {
                if (err) {
                    reportError(404, err, res)
                } else {
                    caseSetsCollection.findOne({"setID": setID}, function(err, caseSet) {
                        if (err) {
                            reportError(404, err, res)
                        } else {
                            var answer = {
                                "owners": owners,
                                "answerData": answerData,
                                "submissionDate": (new Date()).getTime()
                            }

                            caseSet["cases"][caseID]["answers"].push(answer)

                            caseSetsCollection.save(caseSet, function(err) {
                                if (err) {
                                    reportError(404, err, res)
                                } else {
                                    res.send(caseSet)
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}
