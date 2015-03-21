function init() {
    selectorView.showAllLectures();
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
