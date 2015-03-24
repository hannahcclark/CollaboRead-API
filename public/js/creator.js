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

        AWS.config.update({accessKeyId: 'AKIAIJFCXMACGVQPUFAQ', secretAccessKey: '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'});
    	var bucket = new AWS.S3({params: {Bucket: 'collaboread'}});

        $("#creator-modal-title").html("Create New Case");
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

        $("#creator-modal-body").html(form);
        $("#creator-modal").modal("show");

        $("#creator-modal-button-submit").click(function() {

            var file = $("#scanFile0")[0].files[0];

            if (file) {
                var fileName = "img/cases/54f66e8e6771f0152095515a" + "/" + $("#nameField").val() + "/" + $("#scanName0").val() + "/" + file.name;

                var params = {  Key: fileName,
                                ContentType: file.type,
                                Body: file,
                                ACL: 'public-read'};

                bucket.putObject(params, function (err, data) {

                    if (!err) {

                        var scanList = [];

                        var sliceList = [];

                        sliceList.push({
                            "url": "http://s3.amazonaws.com/collaboread/"+fileName,
                            "hasDrawing": false
                        })

                        var scan = {
                            "name": $("#scanName0").val(),
                            "hasDrawing": false,
                            "slices": sliceList
                        };

                        scanList.push(scan);

                        var caseData = {
                            "name": $("#nameField").val(),
                            "patientInfo": $("#patientInfoField").val(),
                            "owners": ["54f66e8e6771f0152095515a"],
                            "scans": scanList
                        }

                        APIClientService.createCase(caseData, null, function() {
                            selectorView.showAllCasesForLecturer("54f66e8e6771f0152095515a");
                            $("#creator-modal").modal("hide");
                        });

                    } else {
                        console.error("error uploading file");
                    }

                });
            }
        });
    },

    createScanInput: function(index) {
        var scanLabel = "<label for='scan"+index+"'>Scan "+index+"</label>"
        var scanName = "<input type='text' class='form-control' name='scanName"+index+"' id='scanName"+index+"' placeholder='Scan Name'/>"
        var scanFile = "<input type='file' name='scanFile"+index+"' id='scanFile"+index+"' multiple/>"
        return scanLabel+scanName+scanFile;
    }

};
