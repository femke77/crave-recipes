$(document).ready(function () {
  $(".notification").hide();

  // On search button click logged in version
  $("#searchButton").on("click", function () {
    // Grab input from search
    var keyword = $("#searchInput").val().trim();
    $("#searchInput").val("");

    //Send the GET request.
    $.ajax("/api/search/" + keyword, {
      type: "GET",
    }).then(function (response) {
      $("#recipesBody").empty();

      for (let i = 0; i < response.length; i++) {
        const element = response[i];

        $("#recipesBody").append(
          `<div class="column is-one-third is-fullheight is-align-items-stretch is-flex" id="${element.id}">
            <a href="/full-recipe/${element.id}">      
          <div class="card large recipe-card" >
                    <div class="card-image">
                        <figure class="image">
                            <!-- image  -->
                            <img src="${element.image}" />
                        </figure>
                    </div>
                    <div class="card-content">
                        <div class="media">
                            <div class="media-content">
                                <p class="title is-4 no-padding">
                                    ${element.title}
                                </p>
                                <p class="subtitle is-6">Dish type: ${element.dishType}</p>
                            </div>
                        </div>
                        <div class="content">
                            <p>Serves: ${element.servings}</p>

                        </div>
                    </div>
                </div>
                </a>   
                <footer class="card-footer">
                  <div >
                    <a class="card-footer-item" id="saveRecipe" data-id="${element.id}">Save to Faves</a>
                  </div>
                </footer>
            </div>`
        ); //end append
      }
    });
  });
  // End Search Click

  //save recipe
  $(document).on("click", "#saveRecipe", function () {
    var currentRecipe = $(this).attr("data-id");
    $.get("/api/user").then(function (user) {
      var userId = user.id;
      $.post("/api/save/" + userId + "/" + currentRecipe, {}).then(function () {
        console.log("saved");
        $(".notification").show();
        setTimeout(function () {
          $(".notification").hide();
        }, 3000);
      });
    });
  });

  // On dashboard load display the user's saved recipes
  $.get("/api/user").then(function (user) {
    var userid = user.id;
    //Send the GET request to saves table
    $.ajax("/api/saved/" + userid, {
      type: "GET",
    }).then(function (response) {
      if (response.length === 0) {
        $("#recipesBody").append("<h3>No saved recipes yet!</h3>");
      } else {
        $("#recipesBody").empty();
        for (let i = 0; i < response.length; i++) {
          const element = response[i];

          // Append recipe cards  to recipe container
          $("#recipesBody").append(
            `<div class="column is-one-third is-fullheight is-align-items-stretch is-flex" id="${element.id}">
                
               <div class="card large recipe-card ">
                <div class="recipe-full">
                        <div class="card-image">
                            <figure class="image">
                                <!-- image  -->
                                <img src="${element.image}" />
                            </figure>
                        </div>
                        <div class="card-content isFullHeight">
                            <div class="media">
                                <div class="media-content">
                                    <p class="title is-4 no-padding">
                                        ${element.title}
                                    </p>
                                    <p class="subtitle is-6">Dish type: ${element.dishType}</p>
                                </div>
                            </div>
                            <div class="content">
                                <p>Serves: ${element.servings}</p>
    
                            </div>
                          </div>
                      </div> 
                        <footer class="card-footer">
                            <a class="card-footer-item" id="removeSaved" data-id="${element.id}">Remove from Faves</a>        
                        </footer>
                        </div>
                </div>`
          );
        }
      }
    });
  });

  // Card click to display recipe detail view

  $(document.body).on("click", ".recipe-full", function () {
    var recipeId = $(this).parent().parent().attr("id");
    getSavedRecipeWithNotes(recipeId);
  });

  //remove recipe from favorites. Includes removing the note they stored.
  $(document).on("click", "#removeSaved", function () {
    //get recipe id
    var recipeId = $(this).attr("data-id");
    $.get("/api/user").then(function (user) {
      var userId = user.id;
      //ajax call to delete
      $.ajax({
        type: "delete",
        url: "/api/saved/" + userId + "/" + recipeId,
      }).then(function () {
        console.log("removed");
        $.ajax({
          type: "delete",
          url: "/api/note/" + userId + "/" + recipeId,
        }).then(function () {
          console.log("note deleted");
          location.reload();
        });
      });
    });
  });

  $("#saveNote").on("click", function () {
    var note = $("#userNotes").val().trim();
    //get the recipe id from the recipe's modal
    var currentRecipe = $(this).data("recipeData");
    //get the user id from session
    $.get("/api/user").then(function (user) {
      var noteObj = {
        note: note,
        RecipeId: currentRecipe.id,
        UserId: user.id,
      };
      //upsert the note data by unique key recipeId and userId
      $.ajax({
        type: "put",
        url: "/api/note",
        data: noteObj,
      }) // need to put the note on the page without a reload!
        .then(function () {
          getSavedRecipeWithNotes(currentRecipe.id);
        });
    });
  });

  $(document.body).on("click", "#removeNote", function () {
    var currentRecipeId = $(this).attr("data-recipeId");
    console.log(currentRecipeId);

    var noteId = $(this).attr("data-noteId");
    $.ajax({
      type: "delete",
      url: "/api/note/" + noteId,
    }).then(function () {
      console.log("note deleted");
      getSavedRecipeWithNotes(currentRecipeId);
    });
  });

  // modal and notification code
  $(document.body).on("click", "#openModal", function () {
    $(".modal").addClass("is-active");
    //fill modal content with the current note if present
    var noteId = $(this).attr("data-noteId");
    console.log(noteId);
    $.get("/api/note/" + noteId).then(function (note) {
      if (note) {
        $("#userNotes").append(note.note);
      }
    });
  });

  $(document.body).on("click", "#closeModal", function () {
    $(".modal").removeClass("is-active");
  });

  $(document.body).on("click", "#saveNote", function () {
    $(".modal").removeClass("is-active");
  });

  // on click of the closing X in the upper right of modal or notification
  $(document.body).on("click", ".delete", function () {
    $(".modal").removeClass("is-active");
    $(".notification").hide();
  });

  function getSavedRecipeWithNotes(recipeId) {
    // Send the GET request with recipeId
    $.ajax("/api/recipe-detailed/" + recipeId, {
      type: "GET",
    }).then(function (response) {
      $("#recipesBody").empty();
      const element = response;
      // Handling ingredients list
      const valuesIng = Object.values(element.ingredients);
      //attach recipe data to modal for use with notes
      $("#saveNote").data("recipeData", element);
      //attach recipe data to recipeBody div
      $("#recipesBody").data("recipeData", element);
      //get the note and the id if it exists.
      const note = element.Notes.length > 0 ? element.Notes[0].note : "";
      const noteId = element.Notes.length > 0 ? element.Notes[0].id : 0;
      // Append to body
      $("#recipesBody").append(
        `<div class="column is-one-quarter">
          <div class="card large">
              <div class="card-image">
                  <figure class="image">
                      <!-- image  -->
                      <img src="${element.image}" />
                  </figure>
              </div>
              <div class="card-content">
                    <div class="media">
                        <div class="media-content">
                            <p class="title is-4 no-padding">
                                ${element.title}
                            </p>
                          <p class="subtitle is-6">Dish type: ${element.dishType}</p>
                        </div>
                    </div>
                    <div class="content">
                        <p>Serves: ${element.servings}</p>

                    </div>
                    </div>
                </div>
                <footer class="card-footer" >
                    <a class="card-footer-item" data-noteId=${noteId} id="openModal">Add or Edit Note</a>
                    <a class="card-footer-item" data-noteId=${noteId} data-recipeId=${element.id} id="removeNote">Remove Note</a>
                </footer>
                </div>
            </div>

            <!-- Card two -->
            <div class="column is-one-quarter">
                <div class="card large">
                    <div class="card-content">
                        <div class="media">
                            <div class="media-content">
                                <p class="title is-4 no-padding">Ingredients</p>
                                <hr>
                            </div>
                        </div>
                        <div class="content">
                            <ul id="recList"></ul >
                        </div >
                    </div >
                </div >
            </div >

          <!-- Card three -->
            <div class="column is-one-quarter">
              <div class="card large">
                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <p class="title is-4 no-padding">Directions</p>
                      <hr>
                                </div>
                    </div>
                    <div class="content">
                      <ol id="recDirections">
                      </ol>
                    </div>
                  </div>
                </div>
              </div> 

              <!-- Card four -->
              <div class="column is-one-quarter">
              <div class="card large note">
                  <div class="card-content">
                      <div class="media">
                          <div class="media-content">
                              <p class="title is-4 no-padding">Notes</p>
                            <hr>
                            ${note}
                        </div>
                      </div>
                    <div class="content">
                    </div>
                  </div>
                </div>
                </div>
                `
      );
      // Handles list of ingredients
      for (let j = 0; j < valuesIng.length; j++) {
        const ing = "<li>" + valuesIng[j] + "</li>";
        $("#recList").append(ing);
      }
      // Handles list of instructions
      var instructions = element.instructions;
      var a1 = new Array();
      a1 = instructions.split(".");
      for (let k = 0; k < a1.length - 1; k++) {
        const instrucDisplay = "<li>" + a1[k] + "</li>";
        $("#recDirections").append(instrucDisplay);
      }
    });
  }
}); //end doc ready fn
