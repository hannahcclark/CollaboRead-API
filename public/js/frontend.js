function init() {
    selectorView.showAllCasesForLecturer("54f66e8e6771f0152095515a");
    // APIClientService.retrieveCaseWithID("5514973dee5c691f05a67a20", function(retrievedCase) {
    //     frontEnd.presentScanView(retrievedCase["scans"][1]);
    // });
    sideBar.updateLectureList("54f66e8e6771f0152095515a");
    frontEnd.updateEvents();
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

            } else if (selectorView.selectorScreen == "case") {

                var separatorIndex = this.id.indexOf("&");
                var caseID = this.id.substring(separatorIndex+1, this.id.length);
                var currentCase;

                for (var i in selectorView.data["scans"]) {
                    if (selectorView.data["scans"][i]["_id"] == caseID) {
                        currentCase = selectorView.data["scans"][i];
                        break;
                    }
                }

                scanView.showScan(currentCase);

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

        $("#sidebar-new-lecture").click(function() {
            creator.showCreateLectureModal();
        });

        $("#addButton").click(function() {
            creator.showCreateCaseModal(null);
        });
    }
    // },
    //
    // presentScanView: function(scan) {
    //     // $("#content").empty();
    //     scanView.showScan(scan);
    // }

}
