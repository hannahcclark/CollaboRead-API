var sideBar = {

    updateLectureList: function(lecturer) {
        APIClientService.retrieveLecturesForLectureOwner(lecturer, function(data) {
            $("#sidebar-lecture-list").empty();

            for (var i in data) {

                var lectureName = data[i].name;
                var lectureID = data[i]["_id"];

                $("#sidebar-lecture-list").append("<li class='lecture-selector' id="+i+"_"+lectureID+"><a href='#'>"+lectureName+"</a></li>")
            }
        });
    }

};
