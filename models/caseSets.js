var caseSetSchema = mongoose.Schema({
    setID   : String,
    owners  : [String],
    cases   : {
        caseID : {
            type    : String,
            images  : [String],
            date    : Date,
            name    : String,
            answers : [{
                owners          : [String],
                answerData      : String,
                submissionDate  : Date
            }],
            lecturerAnswer  : String
        }
    }
});

module.exports = mongoose.model('caseSet', caseSetSchema);
