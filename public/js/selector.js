var selectorView = {

    data: [],
    selectorScreen: "allCases",
    title: "All Cases",

    populateUIWithData: function(data) {

        selectorView.data = data;
        $("#selectorTitle").html(selectorView.title);

        $("#itemGrid").html("");

        for (var i in data) {

            var selectorBlock = $("<div>", {id: i+"_"+data[i]["_id"], class: "selector-block"});

            var blockImage;
            var blockTitle;
            var blockCaseCount;

            /*if (selectorView.selectorScreen == "lectures") {
                // blockImage = data[i].cases[0].scans[0].slices[0].url;
                blockTitle = data[i].name;
                blockCaseCount = data[i].cases.length;

            } else*/ if (selectorView.selectorScreen == "allCases") {
                blockImage = data[i].scans[0].slices[0].url;
                blockTitle = data[i].name;
                blockCaseCount = data[i].scans.length;
            }

            var selectorBlockTop = "<div class='selector-block-top'><img src='"+blockImage+"' class='selector-block-top'/></div>";

            var selectorBlockBottomText = ("<span class='selector-block-title'>"+blockTitle+"</span> ("+blockCaseCount+")");
            var selectorBlockBottom = "<div class='selector-block-bottom'>"+selectorBlockBottomText+"</div>";

            selectorBlock.append(selectorBlockTop+selectorBlockBottom);

            var column = $("<div>", {class: "col-md-2"});
            column.append(selectorBlock);

            $("#itemGrid").append(column);
        }

        frontEnd.updateEvents();
    },

    showAllCasesForLecturer: function(lecturer) {
        selectorView.selectorScreen = "allCases";
        selectorView.title = "All Cases";
        APIClientService.retrieveCasesForLectureOwner(lecturer, this.populateUIWithData);
        // APIClientService.retrieveLectures(this.populateUIWithData);
    },

    showCasesForLecture: function(lecture, lectureName) {
        selectorView.selectorScreen = "cases";
        selectorView.title = lectureName;
        APIClientService.retrieveCasesForLecture(lecture, this.populateUIWithData);
    }
}
