var bodyParser = require('body-parser');
var bodyParserURLEncoded = bodyParser.urlencoded({extended: true});

var validator = require('validator');

var User = require('../app/models/user');
var CaseSets = require('../app/models/caseSets');

var prefix = "/api/v1/"

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressSession = require('express-session');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        User.findOne({'email': email}, function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, {message: 'Incorrect username.'});
            }

            if (!user.validPassword(password)) {
                return done(null, false, {message: 'Incorrect password.'});
            }

            return done(null, user);
        });
    }
));

function reportError(status, error, response) {
    console.log(error)
    response.status(status).end()
    response.send()
}

var updateDates = {};

//nothing is validated right now. that should be fixed

module.exports = function(http, ws) {

    http.use(expressSession({secret: 'secretkey'}));
    http.use(passport.initialize());
    http.use(passport.session());

// http routes

    http.post(prefix+'login', bodyParserURLEncoded, passport.authenticate('local', {session: false}), function(req, res) {
        User.findOne({'email': req.body.email}, function(err, user) {
            res.send(user);
        });
    });

    http.get(prefix+'users', passport.authenticate('local', {session: false}), function(req, res) {
            // var userQuery = validator.escape(req.query.id);
            var userQuery = req.query.id;

            if (!userQuery) {
                User.find({}, function(err, userResults) {
                    res.send(userResults);
                });

            } else {
                User.findOne({"_id":userQuery}, function(err, userID) {
                    if (err) {
                        reportError(404, err, res);
                    } else {
                        res.send(userID);
                    }
                });
            }
    });

    http.get(prefix+'lecturers', passport.authenticate('local', {session: false}), function(req, res) {
        // var lecturerQuery = validator.escape(req.query.id);
        var lecturerQuery = req.query.id;

        if (!lecturerQuery) {
            User.find({"type":"lecturer"}, function(err, lecturerResults) {
                res.send(lecturerResults);
            });

        } else {
            User.findOne({"type":"lecturer", "_id":lecturerQuery}, function(err, userID) {
                if (err) {
                    reportError(404, error, res);
                } else {
                    res.send(userID);
                }
            });
        }
    });

    http.post(prefix+'usercheck', bodyParserURLEncoded, passport.authenticate('local', {session: false}), function(req, res) {
        var users = req.body.users ? JSON.parse(req.body.users) : null;
        if (users) {
            User.find({"email": {$in: users}}, {"email": 1, "name": 1, "_id": 1}, function(err, userList) {
                if (!err) {
                    res.send(userList);
                } else {
                    res.status(404).end();
                }
            });
        } else {
            res.status(404).end();
        }
    });

    http.get(prefix+'casesets', passport.authenticate('local', {session: false}), function(req, res) {
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

    http.post(prefix+'submitanswer', bodyParserURLEncoded, passport.authenticate('local', {session: false}), function(req, res) {
        // var setID = validator.escape(req.body.setID)
        // var caseID = validator.escape(req.body.caseID)
        // var owners = validator.escape(req.body.owners)
        // var answerData = validator.escape(req.body.answerData)
        var setID = req.body.setID;
        var caseID = req.body.caseID;
        var owners = req.body.owners;

        //rename this shit
        var answerData = req.body.drawings;

        if (!owners || !answerData) {
            reportError(404, "Missing required parameters", res)
        } else {
            CaseSets.findOne({"setID": setID}, function(err, caseSet) {
                if (err) {
                    reportError(404, err, res)
                } else {

                    var answer = {
                        "owners": JSON.parse(owners),
                        "drawings": JSON.parse(answerData),
                        "submissionDate": (new Date()).getTime()
                    }

                    for (c in caseSet["cases"]) {
                        if (caseSet["cases"][c]["caseID"] == caseID) {

                            var currentCase = caseSet["cases"][c];

                            // determine if user has already submitted an answer
                            var resubmission = false;
                            var submissionOwners = answer["owners"].toString()

                            for (var a = 0; a < currentCase["answers"].length; a++) {
                                var answerOwners = currentCase["answers"][a]["owners"].toString();

                                if (submissionOwners === answerOwners) {
                                    resubmission = true;
                                    caseSet["cases"][c]["answers"][a].drawings = answer.drawings;
                                    caseSet["cases"][c]["answers"][a].submissionDate = (new Date()).getTime();
                                    break;
                                }
                            }

                            if (!resubmission) {
                                caseSet["cases"][c]["answers"].push(answer);
                            }

                            updateDates[currentCase["caseID"]] = answer.submissionDate;

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

    ws.on('connection', function connection(connection) {
        connection.on('message', function incoming(message) {
            if (message) {
                if (updateDates[message]) {
                    connection.send(updateDates[message].toString());
                }
            }
        });
    });
}
