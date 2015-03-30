var scanView = {

    currentCase: null,
    selectedIndex: 0,

    showScan: function(scan) {
        $("#itemGrid").empty();

        $("#patientHistory").css("display", "none");
        $("#patientHistoryDescription").empty();

        for (var i in selectorView.breadCrumbs) {
            if (i == 0) {
                $("#selectorTitle").html("<a href='#' id='breadcrumb"+i+"'>"+selectorView.breadCrumbs[i])+"</a>";
            } else if (i == 1) {
                $("#selectorTitle").append(" > <a href='#' id='breadcrumb"+i+"'>"+selectorView.breadCrumbs[i]+"</a>")
            }
        }

        $("#selectorTitle").append(" > "+scan["name"]);
        $("#selectorTitle").append(" <a href='#' id='editScanTitle'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></a>");

        var theater = "<div id='theater'></div>";
        $("#itemGrid").append(theater);
        $("#theater").html("<img id='theaterImage' src='"+scan["slices"][0]["url"]+"' />");
        $("#itemGrid").append("<hr/>");
        $("#itemGrid").append("<div class='row' id='sliceSelector'></div>")

        for (var i in scan["slices"]) {
            var selectorBlock = $("<div>", {id: i, class: "selector-block"});

            var imageURL = scan["slices"][i]["url"];

            var selectorBlockTop = "<div class='selector-block-top'><img src='"+imageURL+"' class='selector-block-top'/></div>";

            var imageName = imageURL.substr(imageURL.lastIndexOf("/")+1, imageURL.length);

            var selectorBlockBottom = "<div class='selector-block-bottom'><span class='selector-block-title'>"+imageName+"</span></div>";
            selectorBlock.append(selectorBlockTop+selectorBlockBottom);
            var column = $("<div>", {class: "col-md-2"});
            column.append(selectorBlock);
            $("#sliceSelector").append(column);
        }

        frontEnd.updateEvents();

        $(".selector-block").click(function() {
            $("#theater").empty();
            $("#theater").html("<img id='theaterImage' src='"+scan["slices"][this.id]["url"]+"' />");
        });

        $("#editScanTitle").click(function() {
            creator.showEditTitleForScan(scanView.currentCase["_id"], scan["_id"], scan["name"]);
        });
    }
};
