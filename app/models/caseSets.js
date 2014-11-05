var mongoose = require('mongoose');

var Answer = mongoose.Schema({
    owners          : [String],
    answerData      : [{
        x : Number,
        y : Number,
        isEnd : Number
    }],
    submissionDate  : Date
});

var Case = mongoose.Schema({
    caseID  : String,
    images  : [String],
    date    : Date,
    name    : String,
    answers : [Answer],
    lecturerAnswer  : String
});

var caseSetSchema = mongoose.Schema({
    setID   : String,
    owners  : [String],
    cases   : [Case]
}, {collection: 'caseSets'});

module.exports = mongoose.model('caseSet', caseSetSchema);
