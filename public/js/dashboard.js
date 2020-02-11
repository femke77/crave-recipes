$(document).ready(function() {
  $("#dash").show();
  $("#logout").show();

  // On search click (logged in)
  $("#searchButton").on("click", function() {
    // Grab input from search
    var keyword = $("#searchInput")
      .val()
      .trim();
    $("#searchInput").val("");

    //Send the GET request.
    $.ajax("/api/search/" + keyword, {
      type: "GET"
    }).then(function(response) {
      $("#recipesBody").empty();

      for (let i = 0; i < response.length; i++) {
        const element = response[i];

        $("#recipesBody").append(
          `<div class="column is-one-third" id="${element.id}">
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
  $(document).on("click", "#saveRecipe", function() {
    console.log("save clicked");
    var currentRecipe = $(this).attr("data-id");
    $.get("/user").then(function(user) {
      var userId = user.id;
      $.post("/api/save/" + userId + "/" + currentRecipe, {}).then(function() {
        console.log("saved");
      });
    });
  });

  // On dashboard load display the user's saved recipes
  $.get("/user").then(function(user) {
    var userid = user.id;
    // // Send the GET request.
    $.ajax("/api/saved/" + userid, {
      type: "GET"
    }).then(function(response) {
      $("#recipesBody").empty();

      for (let i = 0; i < response.length; i++) {
        const element = response[i];

        // Append recipe cards  to recipe container
        $("#recipesBody").append(
          `<div class="column is-one-third " id="${element.id}">
                    <div class="card large recipe-card ">
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
                    <footer class="card-footer">
                        <a class="card-footer-item" id="removeSaved" data-id="${element.id}">Remove from Faves</a>        
                    </footer>
                </div>`
        );
      } //end for loop
    });
  });

  // Card click to display recipe detail view
  $(document.body).on("click", ".recipe-card", function() {
    //id = title in this case. This has to be corrected b/c title is not unique in db
    var recipeId = $(this)
      .parent()
      .attr("id");
    console.log(recipeId);
    $.get("/user")
      .then(function(user) {
        return user.id;
      })
      .then(function(userId) {
        // Send the PUT request.
        $.ajax("/api/recipe/" + recipeId, {
          type: "GET"
        })
          .then(function(response) {
            $("#recipesBody").empty();
            const element = response;
            // Handling ingredients list
            const valuesIng = Object.values(element.ingredients);
            //attach recipe data to modal for use with notes
            $("#saveNote").data("recipeData", element);
            //attach recipe data to recipeBody div
            $("#recipesBody").data("recipeData", element);

            // Append them to food list
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
            <footer class="card-footer">
                <a class="card-footer-item" id="openModal">Add or Edit Note</a>
                <a class="card-footer-item">Remove from Faves</a>
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
                        <ul id="recList">
          </ul >
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
      `
            );

            // Handles recipes list
            for (let j = 0; j < valuesIng.length; j++) {
              const ing = "<li>" + valuesIng[j] + "</li>";
              $("#recList").append(ing);
            }
            // Instructions listing
            var instructions = element.instructions;
            var a1 = new Array();
            a1 = instructions.split(".");
            for (let k = 0; k < a1.length - 1; k++) {
              const instrucDisplay = "<li>" + a1[k] + "</li>";
              $("#recDirections").append(instrucDisplay);
            }
            return element;
          })
          .then(function(element) {
            var recipeId = element.id;
            $.get("/api/note/" + recipeId + "/" + userId).then(function(note) {
              if (note) {
                $("#recipesBody").append(
                  `<div class="column is-one-quarter">
                      <div class="card large note">
                          <div class="card-content">
                              <div class="media">
                                  <div class="media-content">
                                      <p class="title is-4 no-padding">Notes</p>
                                    <hr>
                                    ${note.note}
                                 </div>
                              </div>
                            <div class="content">
                     </div>
                  </div>
                </div>
            </div>
            `
                );
              } else {
                $("#recipesBody").append(
                  `<div class="column is-one-quarter">
                        <div class="card large note">
                            <div class="card-content">
                                <div class="media">
                                    <div class="media-content">
                                        <p class="title is-4 no-padding">Notes</p>
                                      <hr>
                                    
                                   </div>
                                </div>
                              <div class="content">
                       </div>
                    </div>
    
                  </div>
              </div>
              `
                );
              }
            });
          });
      });
  });

  //remove recipe from saved
  $(document).on("click", "#removeSaved", function() {
    console.log("removed");
  });

  $("#saveNote").on("click", function() {
    var note = $("#userNotes")
      .val()
      .trim();
    //get the recipe id from the recipe's modal
    var currentRecipe = $(this).data("recipeData");
    //get the user id from session
    $.get("/user").then(function(user) {
      var noteObj = {
        note: note,
        RecipeId: currentRecipe.id,
        UserId: user.id
      };
      //upsert the note data by unique key recipeId and userId
      $.ajax({
        type: "put",
        url: "/api/note",
        data: noteObj
      }).then(function() {
        $("#userNotes").val(" ");
        //attache the note id for deletion (not sure of the data's lifespan though)
        $.get("/api/note/" + noteObj.RecipeId + "/" + noteObj.UserId).then(
          function(note) {
            $("#recipesBody").data("noteData", note);
          }
        );
      });
    });
  });

  $("#deleteNote").on("click", function() {
    //get id from element data
    var noteId = 2;
    $.ajax({
      type: "delete",
      url: "/api/note/" + noteId
    }).then(function() {
      console.log("note deleted");
    });
  });

  $(document.body).on("click", "#openModal", function() {
    $(".modal").addClass("is-active");
  });

  $(document.body).on("click", "#closeModal", function() {
    $(".modal").removeClass("is-active");
  });

  $(document.body).on("click", "#saveNote", function() {
    $(".modal").removeClass("is-active");
  });

  //removes the closing X in the upper right of modal
  $(document.body).on("click", ".delete", function() {
    $(".modal").removeClass("is-active");
  });
}); //end doc ready fn
