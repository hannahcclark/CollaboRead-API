var bodyParser = require('body-parser');
var bodyParserURLEncoded = bodyParser.urlencoded({extended: true});

var validator = require('validator');

var User = require('../app/models/user');
var CaseSets = require('../app/models/caseSets');

var prefix = "/api/v1/"

function reportError(status, error, response) {
    console.log(error)
    response.status(status).end()
    response.send()
}

//nothing is validated right now. that should be fixed

module.exports = function(http, ws) {

// http routes

    http.get(prefix+'users', function(req, res) {
        // var userQuery = validator.escape(req.query.id);
        var userQuery = req.query.id;

        if (!userQuery) {
            User.find({}, function(err, userResults) {
                res.send(userResults);
            });

        } else {
            User.findOne({"userID":userQuery}, function(err, userID) {
                if (err) {
                    reportError(404, err, res);
                } else {
                    res.send(userID);
                }
            });
        }
    });

    http.get(prefix+'lecturers', function(req, res) {
        // var lecturerQuery = validator.escape(req.query.id);
        var lecturerQuery = req.query.id;

        if (!lecturerQuery) {
            User.find({"type":"lecturer"}, function(err, lecturerResults) {
                res.send(lecturerResults);
            });

        } else {
            User.findOne({"type":"lecturer", "userID":lecturerQuery}, function(err, userID) {
                if (err) {
                    reportError(404, error, res);
                } else {
                    res.send(userID);
                }
            });
        }
    });

    http.get(prefix+'casesets', function(req, res) {
        // var setID = validator.escape(req.query.id);
        // var lecturerID = validator.escape(req.query.lecturerID);
        var setID = req.query.id;
        var lecturerID = req.query.lecturerID;

        if (setID) {
            CaseSets.findOne({"setID": setID}, function(err, caseSet) {
                if (err) {
                    reportError(404, err, res);
                } else {
                    res.send(caseSet);
                }
            });
        } else if (lecturerID) {
            CaseSets.find({"owners": lecturerID}, function(err, caseSets) {
                if (err) {
                    reportError(404, err, res);
                } else {
                    res.send(caseSets);
                }
            });
        } else {
            reportError(404, "No query specified", res);
        }
    });

    http.post(prefix+'submitanswer', bodyParserURLEncoded, function(req, res) {
        // var setID = validator.escape(req.body.setID)
        // var caseID = validator.escape(req.body.caseID)
        // var owners = validator.escape(req.body.owners)
        // var answerData = validator.escape(req.body.answerData)
        var setID = req.body.setID;
        var caseID = req.body.caseID;
        var owners = req.body.owners;
        var answerData = req.body.answerData;

        if (!owners || !answerData) {
            reportError(404, "Missing required parameters", res)
        } else {
            CaseSets.findOne({"setID": setID}, function(err, caseSet) {
                if (err) {
                    reportError(404, err, res)
                } else {

                    var answer = {
                        "owners": JSON.parse(owners),
                        "answerData": JSON.parse(answerData),
                        "submissionDate": (new Date()).getTime()
                    }

                    for (c in caseSet["cases"]) {
                        if (caseSet["cases"][c]["caseID"] == caseID) {
                            console.log(caseSet["cases"][c]);
                            caseSet["cases"][c]["answers"].push(answer);
                        }
                    }

                    caseSet.save(function(err) {
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

// websockets

    var count = 0;
    var clients = {};

    ws.on('request', function(req) {
        var connection = req.accept(null, req.origin);

        var id = count++;
        clients[id] = connection;

        connection.on('message', function(message) {

            if (message.type == 'utf8') {
                console.log("received " + message.utf8Data)

                for (var c in clients) {
                    clients[c].sendUTF(message.utf8Data);
                }
            }

            connection.on('close', function(connection) {
                    delete clients[id];
                    console.log("closed "+id);
            });
        });
    });
}
