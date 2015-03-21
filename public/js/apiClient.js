var APIClientService = {

    retrieveLecturesForLectureOwner: function(lecturer, cb) {
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
    },

    retrieveCasesForLectureOwner: function(lectureOwner, cb) {
        $.ajax ({
            url: "http://localhost:5000/api/v1/cases?lectureOwnerID="+lectureOwner,
            type: "GET",
            success: function(data) {
                cb(data);
            }
        });
    }
};
