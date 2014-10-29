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

module.exports = mongoose.model('User', userSchema);
