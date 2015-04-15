function init() {
    selectorView.showAllCasesForLecturer("552c5ab98f7c17384e68cf6e");
    sideBar.updateLectureList("552c5ab98f7c17384e68cf6e");
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
                scanView.currentCase = selectorView.data;
                scanView.showScan(currentCase);
                selectorView.selectorScreen = "scan";

            }
        });

        $("#sidebar-all-cases").click(function() {
            selectorView.showAllCasesForLecturer("552c5ab98f7c17384e68cf6e");
            $(".lecture-selector").removeClass("nav-sidebar-active");
            $("#sidebar-all-cases-li").removeClass("nav-sidebar-active");
            $("#sidebar-all-cases-li").addClass("nav-sidebar-active");
        });

        $(".lecture-selector").click(function() {
            var caseID = this.id.substring(2, this.id.length);
            var lectureIndex = parseInt(this.id.substring(0,1));
            selectorView.showCasesForLecture(caseID, this.innerText);
            $(".lecture-selector").removeClass("nav-sidebar-active");
            $("#sidebar-all-cases-li").removeClass("nav-sidebar-active");
            $(this).addClass("nav-sidebar-active");
        });

        $("#sidebar-new-lecture").click(function() {
            creator.showCreateLectureModal();
        });

        $("#addButton").click(function() {
            creator.showCreateCaseModal(null);
        });

        $("#breadcrumb0").click(function() {
            selectorView.showAllCasesForLecturer("552c5ab98f7c17384e68cf6e");
        });

        $("#breadcrumb1").click(function() {
            selectorView.showCase(selectorView.data["_id"], selectorView.data["name"]);
        });

        $("#editTitle").click(function() {

            if (selectorView.selectorScreen == "caseList") {
                creator.showEditTitleForLecture(selectorView.lectureID, selectorView.breadCrumbs[0]);

            } else if (selectorView.selectorScreen == "case") {
                creator.showEditTitleForCase(selectorView.data["_id"], selectorView.data["name"]);
            }
        });

        $("#editPatientInfo").click(function() {
            creator.showEditPatientInfoForCase(selectorView.data["_id"], selectorView.data["patientInfo"]);
        });
    }

}
