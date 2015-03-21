var sideBar = {

    updateLectureList: function(lecturer) {
        APIClientService.retrieveLecturesForLectureOwner(lecturer, function(data) {
            $("#sidebar-lecture-list").empty();

            for (var i in data) {
                $("#sidebar-lecture-list").append("<li><a href='#'>"+data[i].name+"</a></li>")
            }
        });
    }

};
