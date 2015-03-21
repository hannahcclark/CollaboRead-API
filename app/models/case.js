var mongoose = require('mongoose');

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
    // answers: [Answer],
    patientInfo: String
}, {collection: 'cases'});

module.exports = mongoose.model('case', Case);
