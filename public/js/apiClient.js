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
            success: cb,
            error: function() {
                console.error("creation failed");
            }
        });
    },

    createCase: function(data, cb) {
        $.ajax({
            url: "http://localhost:5000/api/v1/cases",
            type: "PUT",
            data: data,
            success: cb,
            error: function() {
                console.error("creation failed");
            }
        });
    },

// edit methods

    editLectureTitle: function(lectureID, lectureTitle, cb) {
        $.ajax({
            url: "http://localhost:5000/api/v1/lectures",
            type: "POST",
            data: "lectureID="+lectureID+"&lectureTitle="+lectureTitle,
            success: cb
        });
    },

    editCaseTitle: function(caseID, caseTitle, cb) {
        $.ajax({
            url: "http://localhost:5000/api/v1/cases",
            type: "POST",
            data: "caseID="+caseID+"&caseTitle="+caseTitle,
            success: cb
        });
    },

    editScanTitle: function(caseID, scanID, scanTitle, cb) {
        $.ajax({
            url: "http://localhost:5000/api/v1/cases",
            type: "POST",
            data: "caseID="+caseID+"&scanID="+scanID+"&scanTitle="+scanTitle,
            success: function(data) {
                cb(data);
            }
        });
    }
};
