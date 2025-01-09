$(document).ready(function() {
  //Add dynamic ingredient fields to form for creating a new recipe
  $("#addField").on("click", function(event) {
    event.preventDefault();
    var html =
      "<div class='field' <div class='control'> <input class='input ingredient' id='ingredient' type='text'></div></div>";
    $("#ingredientField").append(html);
  });

  //validate the form and display messages for incorrect fields if required

  var form = $(".recipe");
  form.validate({
    rules: {
      title: "required",
      servings: "required",
      category: "required",
      dishType: "required",
      ingredient: "required",
      instructions: "required"
    },
    messages: {
      title: "Please specify the title.",
      servings: "Specify number of servings.",
      category: "Please specify the cuisine type.",
      dishType: "Please specify the type of dish.",
      ingredient: "Please specify ingredient.",
      instructions: "Please enter the instructions for making the recipe."
    }
  });

  //Submit a new recipe
  $("#submitRecipe").on("click", function(event) {
    event.preventDefault();

    if (form.valid()) {
      console.log("valid form");

      var ingredientJSON = {};
      var count = 0;

      //find all elements of class ingredient and make a json of the ingredient_count and value
      $(".ingredient").each(function() {
        ingredientJSON["ingredient_" + count++] = $(this).val();
      });
      //get the user id from session else null is allowed
      $.get("/api/user")
        .then(function(user) {
          return user.id;
        })
        .then(function(userId) {
          //make a new recipe object with user id
          let newRecipe = {
            title: $("#title")
              .val()
              .trim(),
            servings: $("#servings").val(),
            image: $("#image")
              .val()
              .trim(),
            category: $("#category").val(),
            dishType: $("#dishType").val(),
            source: $("#source")
              .val()
              .trim(),
            instructions: $("#instructions")
              .val()
              .trim(),
            ingredients: ingredientJSON,
            UserId: userId
          };
          console.log(newRecipe);
          //send to database with post
          $.post("/api/submission", newRecipe, function() {
            console.log("posted");
            //try to go to dashboard & if not logged in will go to home page
            window.location.replace = "/dashboard";
          });
        });
    }
  });
});
