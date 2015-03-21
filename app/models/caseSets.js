var mongoose = require('mongoose');
var Case = require('./case.js');

// var Answer = mongoose.Schema({
//     answerID        : String,
//     owners          : [String],
//     answerName      : String,
//     drawings        : [{
//         scanID  : String,
//         sliceID : String,
//         data    : [{
//             x       : Number,
//             y       : Number,
//             isEnd   : Number
//         }]
//     }],
//     submissionDate  : Date
// });

var caseSetSchema = mongoose.Schema({
    owners  : [String],
    name    : String,
    cases   : [String]
}, {collection: 'lectures'});

module.exports = mongoose.model('caseSet', caseSetSchema);
