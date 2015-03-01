var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    userID  : String,
    name    : String,
    type    : String,
    title   : String,
    year    : String,
    picture : String,
    email   : String,
    password: String,
    caseSets: [String]
});

userSchema.methods.validPassword = function(pass) {
    return (this.password == pass);
};

module.exports = mongoose.model('User', userSchema);
