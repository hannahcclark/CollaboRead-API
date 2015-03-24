var APIClientService = {

// retrieval methods

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
    },

    retrieveCaseWithID: function(caseID, cb) {
        $.ajax({
            url: "http://localhost:5000/api/v1/cases?caseID="+caseID,
            type: "GET",
            success: function(data) {
                cb(data);
            }
        });
    },

// creation methods

    createLecture: function(name, ownerID, cb) {
        $.ajax({
            url: "http://localhost:5000/api/v1/lectures",
            type: "PUT",
            data: "name="+name+"&owner="+ownerID,
            success: function() {
                cb();
            },
            error: function() {
                console.error("creation failed");
            }
        });
    },

    createCase: function(data, lecture, cb) {
        $.ajax({
            url: "http://localhost:5000/api/v1/cases",
            type: "PUT",
            data: data,
            success: function() {
                cb();
            },
            error: function() {
                console.error("creation failed");
            }
        });
    }

};
