var APIClientService = {

    retrieveLectures: function(cb) {
        $.ajax ({
            url: "http://localhost:5000/api/v1/lectures",
            type: "GET",
            success: function(data) {
                cb(data);
            }
        });
    },

    retrieveCasesForLecture: function(lecture, cb) {
        $.ajax ({
            url: "http://localhost:5000/api/v1/cases?lectureID="+lecture,
            type: "GET",
            success: function(data) {
                cb(data);
            }
        });
    }
};
