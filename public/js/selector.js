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

            var blockImage = data[i].scans[0].slices[0].url;
            var blockTitle = data[i].name;
            var blockCaseCount = data[i].scans.length;

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
        selectorView.selectorScreen = "lecture";
        selectorView.title = lectureName;
        APIClientService.retrieveCasesForLecture(lecture, this.populateUIWithData);
    }
}
