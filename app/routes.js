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

module.exports = function(app) {

    app.get(prefix+'users', function(req, res) {
        var userQuery = validator.escape(req.query.id);

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

    app.get(prefix+'lecturers', function(req, res) {
        var lecturerQuery = validator.escape(req.query.id);

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

    app.get(prefix+'casesets', function(req, res) {
        var setID = validator.escape(req.query.id);
        var lecturerID = validator.escape(req.query.lecturerID);

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

    app.post(prefix+'submitanswer', bodyParserURLEncoded, function(req, res) {
        var setID = validator.escape(req.body.setID)
        var caseID = validator.escape(req.body.caseID)
        var owners = validator.escape(req.body.owners)
        var answerData = validator.escape(req.body.answerData)

        if (!owners || !answerData) {
            reportError(404, "Missing required parameters", res)
        } else {
            CaseSets.findOne({"setID": setID}, function(err, caseSet) {
                if (err) {
                    reportError(404, err, res)
                } else {

                    var answer = {
                        "owners": owners,
                        "answerData": answerData,
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
}
