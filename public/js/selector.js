var selectorView = {

    data: [],
    selectorScreen: "caseList",
    title: "All Cases",

    populateUIWithData: function(data) {

        selectorView.data = data;
        $("#selectorTitle").html(selectorView.title);

        $("#itemGrid").empty();

        var itr;

        if (selectorView.selectorScreen == "caseList") {
            itr = data;
        } else if (selectorView.selectorScreen == "case") {
            itr = data.scans;
        }

        for (var i in itr) {

            var selectorBlock = $("<div>", {id: i+"_"+itr[i]["_id"], class: "selector-block"});

            if (selectorView.selectorScreen == "caseList") {
                var blockImage = itr[i].scans[0].slices[0].url;
                var blockTitle = itr[i].name;
                var blockCaseCount = itr[i].scans.length;

            } else if (selectorView.selectorScreen == "case") {
                var blockImage = itr[i].slices[0].url;
                var blockTitle = itr[i].name;
            }

            var selectorBlockTop = "<div class='selector-block-top'><img src='"+blockImage+"' class='selector-block-top'/></div>";

            var selectorBlockBottomText = ("<span class='selector-block-title'>"+blockTitle+"</span>");

            if (selectorView.selectorScreen == "caseList") {
                selectorBlockBottomText +=  " ("+blockCaseCount+")";
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
        APIClientService.retrieveCasesForLectureOwner(lecturer, this.populateUIWithData);
    },

    showCasesForLecture: function(lecture, lectureName) {
        selectorView.selectorScreen = "caseList";
        selectorView.title = lectureName;
        APIClientService.retrieveCasesForLecture(lecture, this.populateUIWithData);
    },

    showCase: function(caseID) {
        selectorView.selectorScreen = "case";
        selectorView.title = "case test";
        APIClientService.retrieveCaseWithID(caseID, this.populateUIWithData);
    }
}
