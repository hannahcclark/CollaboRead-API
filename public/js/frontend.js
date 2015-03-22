function init() {
    selectorView.showAllCasesForLecturer("54f66e8e6771f0152095515a");
    sideBar.updateLectureList("54f66e8e6771f0152095515a");
}

var frontEnd = {

    updateEvents: function() {

        $("*").unbind('click');

        $(".selector-block").click(function() {
            if (selectorView.selectorScreen == "caseList") {

                var separatorIndex = this.id.indexOf("&");
                var caseName = this.id.substring(0, separatorIndex);
                var caseID = this.id.substring(separatorIndex+1, this.id.length);
                selectorView.showCase(caseID, caseName);
            }
        });

        $("#sidebar-all-cases").click(function() {
            selectorView.showAllCasesForLecturer("54f66e8e6771f0152095515a");
        });

        $(".lecture-selector").click(function() {
            var caseID = this.id.substring(2, this.id.length);
            var lectureIndex = parseInt(this.id.substring(0,1));
            selectorView.showCasesForLecture(caseID, this.innerText);
        });
    }

}
