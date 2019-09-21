//articles saved
$(document).on("click", ".save", function() {
    var articleId = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/save/" + articleId
    }).then(function(data) {

    })
    $(this).html("Saved");
    
    var lis = $("li");
    $.each(lis, (i, val) => {
        console.log($(val));
        if ($(val).attr("data-id")===articleId) {
            $(val).remove()
        }
    });
});
//remove
$(document).on("click", ".remove", function() {
    var articleId = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/remove/" + articleId
    }).then(function(data) {

    })
    var lis = $("li");
    $.each(lis, (i, val) => {
        console.log($(val));
        if ($(val).attr("data-id") === articleId) {
            $(val).remove()
        }
    });
});

$(document).on("click", ".note", function() {
    console.log("clickk");

    //article ajax
    $.ajax({
        method: "GET",
        url: "/articles/" + articleId
    })

    $("#notes").append("<h2>" + data.title + "</h2>");
    $("#notes").append("<textarea id='bodyinput' name'body'></textarea>");
    $("#notes").append("<input id = 'titleinput' name='title>");
    $("#notes").append("<button data-id='' + '' id='savenote'> Save Note </button>");

    if (data.note) {
        $("#titleinput").val(data.note.title);
        $("bodyinput").val(data.note.body);
    }
});
//saving
$(document).on("click", "#savenote", function() {
    var articleId = $(this).attr("data-id");
//posting, emptying
$.ajax({
    method: "POST",
    url: "/articles/" + articleId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
  .then(function(data){
  $("#notes").empty();
});
$("#titleinput").val(""); $("#bodyinput").val("");
});
