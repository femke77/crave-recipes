$(".notification").hide();
  
  //save recipe
  $(document).on("click", "#saveRecipe", function() {
    console.log("clicked");
    
    var currentRecipe = $(this).attr("data-id");
    $.get("/api/user").then(function(user) {
      var userId = user.id;
      $.post("/api/save/" + userId + "/" + currentRecipe, {}).then(function() {
        console.log("saved");
        $(".notification").show();
        setTimeout(function() {
          $(".notification").hide();
        }, 3000);
      });
    });
  });