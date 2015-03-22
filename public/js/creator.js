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

        $("#creator-modal-body").html(name);
        $("#creator-modal").modal("show");

        $("#creator-modal-button-submit").click(function() {
            APIClientService.createLecture($("#nameField").val(), "54f66e8e6771f0152095515a", function() {
                sideBar.updateLectureList();
                $("#creator-modal").modal("hide");
            });
        });
    }

};
