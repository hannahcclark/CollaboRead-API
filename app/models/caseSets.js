var mongoose = require('mongoose');

var Answer = mongoose.Schema({
    answerID        : String,
    owners          : [String],
    answerName      : String,
    drawings        : [{
        scanID  : String,
        sliceID : String,
        data    : [{
            x       : Number,
            y       : Number,
            isEnd   : Number
        }]
    }],
    colors: {
        r: Number,
        g: Number,
        b: Number
    },
    submissionDate  : Date
});

var Scan = mongoose.Schema({
    scanID  : String,
    name    : String,
    hasDrawing  : Boolean,
    slices: [{
        sliceID: String,
        url: String,
        hasDrawing: Boolean
    }]
});

var Case = mongoose.Schema({
    caseID  : String,
    date    : Date,
    name    : String,
    scans: [Scan],
    answers: [Answer],
    patientInfo: String
});

var caseSetSchema = mongoose.Schema({
    setID   : String,
    owners  : [String],
    cases   : [Case]
}, {collection: 'caseSets'});

module.exports = mongoose.model('caseSet', caseSetSchema);
