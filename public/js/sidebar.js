var sideBar = {

    // activeState: "sidebar-all-cases",

    updateLectureList: function(lecturer) {

        // $("#"+this.activeState).css("background-color", "red");
        // console.log($("#"+this.activeState));
        // console.log($("#0_5514971fee5c691f05a67a19").css("background-color"));

        APIClientService.retrieveLecturesForLectureOwner(lecturer, function(data) {
            $("#sidebar-lecture-list").empty();

            for (var i in data) {

                var lectureName = data[i].name;
                var lectureID = data[i]["_id"];

                var lectureText = "<a href='#' class='lecture-selector'><span class='glyphicon glyphicon-folder-close'></span> "+lectureName+"</a>";
                $("#sidebar-lecture-list").append("<li class='lecture-selector' id="+i+"_"+lectureID+">"+lectureText+"</li>")
            }
        });
    }

};
