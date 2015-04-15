var selectorView = {

    data: [],
    selectorScreen: "caseList",
    title: "All Cases",
    lectureID: "0",
    breadCrumbs: [],

    populateUIWithData: function(data) {

        selectorView.data = data;
        $("#selectorTitle").empty();

        for (var i in selectorView.breadCrumbs) {
            if (i == 0) {
                $("#selectorTitle").html("<a href='#' id='breadcrumb"+i+"'>"+selectorView.breadCrumbs[i])+"</a>";
            } else if (i == 1) {
                $("#selectorTitle").append(" > <a href='#' id='breadcrumb"+i+"'>"+selectorView.breadCrumbs[i]+"</a>")
            }
        }

        if (selectorView.breadCrumbs[0] != "All Cases" || selectorView.breadCrumbs.length > 1) {
            $("#selectorTitle").append(" <a href='#' id='editTitle'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></a>");
        }

        $("#itemGrid").empty();

        var itr;

        if (selectorView.selectorScreen == "caseList") {
            itr = data;
        } else if (selectorView.selectorScreen == "case") {
            itr = data.scans;
        }

        for (var i in itr) {

            if (selectorView.selectorScreen == "caseList") {
                var blockImage = itr[i].scans[0].slices[0].url;
                var blockTitle = itr[i].name;
                var blockCaseCount = itr[i].scans.length;

                $("#patientHistory").css("display", "none");
                $("#patientHistoryDescription").empty();

            } else if (selectorView.selectorScreen == "case") {
                var blockImage = itr[i].slices[0].url;
                var blockTitle = itr[i].name;

                $("#patientHistory").css("display", "block");
                $("#patientHistoryDescription").html(data.patientInfo);
            }

            var selectorBlock = $("<div>", {id: blockTitle+"&"+itr[i]["_id"], class: "selector-block"});

            var selectorBlockTop = "<div class='selector-block-top'><img src='"+blockImage+"' class='selector-block-top'/></div>";

            var selectorBlockBottomText = ("<span class='selector-block-title'>"+blockTitle+"</span>");

            if (selectorView.selectorScreen == "caseList") {
                selectorBlockBottomText +=  " ("+blockCaseCount+")";
            }

            if (selectorView.selectorScreen == "caseList") {
                selectorBlockBottomText += "<p class='selector-block-bottom-detail-text'>"+itr[i].patientInfo+"</p>";
            }

            var selectorBlockBottom = "<div class='selector-block-bottom'>"+selectorBlockBottomText+"</div>";

            selectorBlock.append(selectorBlockTop+selectorBlockBottom);

            var column = $("<div>", {class: "col-md-2"});
            column.append(selectorBlock);

            $("#itemGrid").append(column);
        }

        frontEnd.updateEvents();
    },

    showAllCasesForLecturer: function(lecturer) {
        selectorView.selectorScreen = "caseList";
        selectorView.title = "All Cases";
        selectorView.lectureID = 0;
        selectorView.breadCrumbs = [selectorView.title];
        APIClientService.retrieveCasesForLectureOwner(lecturer, this.populateUIWithData);
    },

    showCasesForLecture: function(lecture, lectureName) {
        selectorView.selectorScreen = "caseList";
        selectorView.title = lectureName;
        selectorView.lectureID = lecture;
        selectorView.breadCrumbs = [selectorView.title];
        APIClientService.retrieveCasesForLecture(lecture, this.populateUIWithData);
    },

    showCase: function(caseID, caseName) {
        selectorView.selectorScreen = "case";
        selectorView.title = caseName;
        selectorView.lectureID = 0;
        selectorView.breadCrumbs = [selectorView.breadCrumbs[0]];
        selectorView.breadCrumbs.push(selectorView.title);
        APIClientService.retrieveCaseWithID(caseID, this.populateUIWithData);
    }
}
