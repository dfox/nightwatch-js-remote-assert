
$(function(){

    var host = "http://localhost:8080";
    var nameInput = $("#note-name");
    var contentInput = $("#note-content");
    var statusContainer = $("#status");

    $("#load-button").on("click", function(event){
        event.preventDefault();
        
        var name = nameInput.val();
        var url = host + "/notes/" + name;

        $.ajax({
            url: url,
            method: "GET",
            dataType: "text",
            global: false,
            success: function(content){
                contentInput.val(content);
                statusContainer.text("Loaded note: " + name);
            },
            error: function(xhr, status, error){
                statusContainer.text("Error loading note: " + error);
            }
        });
    });
    
    $("#save-button").on("click", function(event){
        event.preventDefault();

        var name = nameInput.val();
        var content = contentInput.val();
        var url = host + "/notes/" + name;

        $.ajax({
            url: url,
            method: "POST",
            contentType: "text/plain",
            data: content,
            success: function(){
                statusContainer.text("Saved note: " + name);
            },
            error: function(xhr, status, error){
                statusContainer.text("Error saving note: " + error);
            }
        });
    });
});
