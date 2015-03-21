function init() {
    selectorView.showAllCasesForLecturer("54f66e8e6771f0152095515a");
    sideBar.updateLectureList("54f66e8e6771f0152095515a");
}

var frontEnd = {

    updateEvents: function() {
        $(".selector-block").click(function() {
            if (selectorView.selectorScreen == "lectures") {
                var caseID = this.id.substring(2, this.id.length);
                var lectureIndex = parseInt(this.id.substring(0,1));

                selectorView.showCasesForLecture(caseID, selectorView.data[lectureIndex].name);
            }
        });
    }

}
