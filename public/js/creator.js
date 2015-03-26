var creator = {

    showCreateLectureModal: function() {
        $("#creator-modal-title").html("Create New Lecture");
        $("#creator-modal-button-submit").text("Create");

        var form = $("<form>");

        var name = "<div class='form-group'>";
        name += "<label for='nameField'>Lecture Name</label>";
        name += "<input type='text' name='nameField' class='form-control' id='nameField' placeholder='Name' />";
        name += "</div>";

        form.append(name);

        $("#creator-modal-body").html(form);
        $("#creator-modal").modal("show");

        $("#creator-modal-button-submit").click(function() {
            APIClientService.createLecture($("#nameField").val(), "54f66e8e6771f0152095515a", function() {
                sideBar.updateLectureList();
                $("#creator-modal").modal("hide");
            });
        });
    },

    caseScanCount: 0,

    showCreateCaseModal: function(context) {

        console.error("aws key missing");
    	var bucket = new AWS.S3({params: {Bucket: 'collaboread'}});

        if (selectorView.lectureID == 0) {
            $("#creator-modal-title").html("Create New Case");
        } else {
            $("#creator-modal-title").html("Add Case to "+selectorView.title);
        }
        $("#creator-modal-button-submit").text("Create");

        var form = $("<form>");

        var name = "<div class='form-group'>";
        name += "<label for='nameField'>Case Name</label>";
        name += "<input type='text' name='nameField' class='form-control' id='nameField' placeholder='Name' />";
        name += "</div>";
        form.append(name);

        var patientInfo = "<div class='form-group'>";
        patientInfo += "<label for='patientInfoField'>Patient Info</label>";
        patientInfo += "<input type='text' name='patientInfoField' class='form-control' id='patientInfoField' placeholder='Patient Info' />";
        patientInfo += "</div>";
        form.append(patientInfo);

        form.append("<hr /><strong>Scans</strong>");

        this.caseScanCount = 0;
        var initialScan = this.createScanInput(this.caseScanCount);

        var scans = "<div class='form-group' id='scansGroup'>"+initialScan+"</div>"

        form.append(scans);

        var addNewScansLink = "<a href='#' id='addNewScansLink'>Add Scan</a>";

        $("#creator-modal-body").html(form);
        $("#creator-modal-body").append(addNewScansLink);

        $("#addNewScansLink").click(function() {
            creator.caseScanCount++;
            var newScan = creator.createScanInput(creator.caseScanCount);
            $("#scansGroup").append(newScan);
        });

        $("#creator-modal").modal("show");

        $("#creator-modal-button-submit").click(function() {

            var scanURLList = [];

            for (var scan = 0; scan <= creator.caseScanCount; scan++) {

                var fileList = $("#scanFile"+scan)[0].files;

                creator.uploadFiles(fileList, 0, scan, bucket);

                var fileURLList = [];

                for (var i = 0; i < fileList.length; i++) {
                    fileURLList.push("http://s3.amazonaws.com/collaboread/img/cases/54f66e8e6771f0152095515a" + "/" + $("#nameField").val() + "/" + $("#scanName"+scan).val() + "/" + fileList[i].name);
                }

                scanURLList.push(fileURLList);

            }

            creator.createCaseObject(scanURLList);
        });
    },

    uploadFiles: function(fileList, index, scan, bucket) {

        var file = fileList[index];

        var fileName = "img/cases/54f66e8e6771f0152095515a" + "/" + $("#nameField").val() + "/" + $("#scanName"+scan).val() + "/" + file.name;

        var params = {  Key: fileName,
                        ContentType: file.type,
                        Body: file,
                        ACL: 'public-read'};

        bucket.putObject(params, function(err, data) {
             if (index < fileList.length - 1) {
                creator.uploadFiles(fileList, index+1, scan, bucket);
            }
            selectorView.showAllCasesForLecturer("54f66e8e6771f0152095515a");
        });

    },

    createCaseObject: function(scanURLList) {

        var scanList = [];

        for (var j = 0; j < scanURLList.length; j++) {

            var sliceList = [];
            var fileURLList = scanURLList[j];

            for (var i in fileURLList) {
                sliceList.push({
                    "url": fileURLList[i],
                    "hasDrawing": false
                });
            }

            var scan = {
                "name": $("#scanName"+j).val(),
                "hasDrawing": false,
                "slices": sliceList
            };

            scanList.push(scan);
        }

        var caseData = {
            "name": $("#nameField").val(),
            "patientInfo": $("#patientInfoField").val(),
            "owners": ["54f66e8e6771f0152095515a"],
            "scans": scanList
        }

        if (selectorView.lectureID != 0) {
            caseData["lectureID"] = selectorView.lectureID;
        }

        APIClientService.createCase(caseData, function() {
            selectorView.showAllCasesForLecturer("54f66e8e6771f0152095515a");
            $("#creator-modal").modal("hide");
        });

    },

    createScanInput: function(index) {
        var scanLabel = "<label for='scan"+index+"'>Scan "+index+"</label>"
        var scanName = "<input type='text' class='form-control' name='scanName"+index+"' id='scanName"+index+"' placeholder='Scan Name'/>"
        var scanFile = "<input type='file' name='scanFile"+index+"' id='scanFile"+index+"' multiple/>"
        return scanLabel+scanName+scanFile;
    }

};
