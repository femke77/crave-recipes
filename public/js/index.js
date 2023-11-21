/* eslint-disable prettier/prettier */
//javascript for the landing page
$(document).ready(function () {
  $("#dash").hide();
  $("#logout").hide();

  $("#login").on("click", function(event){
    event.preventDefault();
    var email = $("#loginEmail").val().trim();
    var password = $("#loginPassword").val().trim();
    var userData = {
      email: email,
      password: password
    };
    if(!userData.email || !userData.password) {
      return;
    }
    loginUser(userData.email, userData.password);
    $("#loginEmail").val(" ");
    $("#loginPassword").val(" ");
  });


  function loginUser(email, password){
    $.post("/api/login", {
      email: email,
      password: password
    }).then(function(){
      window.location.replace("/dashboard");
    }).catch(function(err){
      console.log(err);
    });
  }


  $("#signup").on("click", function(){
    console.log("you clicked on me");
    window.location.href = "/signup";
    return false;
  });


  // On Search Click
  $("#searchButton").on("click", function () {
    console.log("search works");

    // Grab input from search
    var keyword = $("#searchInput")
      .val()
      .trim();
    console.log(keyword);

    // // Send the GET request.
    $.ajax("/api/search/" + keyword, {
      type: "GET"
    }).then(function (response) {
      $("#recipesBody").empty();

      for (let i = 0; i < response.length; i++) {
        const element = response[i];

        // Append them to drink list
        $("#recipesBody").append(
          `<div class="column is-one-third recipe-card" id="${element.title}">
                <div class="card large ">
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
                   
                </footer>
            </div>`
        );
        $(".recipe-card").data("recipe", element);
      }
    });
  });
  // End Search Click



  // Start Card Click to display recipe
  $(document.body).on("click", ".recipe-card", function () {
    console.log("card clicking works");
    var recipeTitle = this.getAttribute("id");
    console.log(`id: ${recipeTitle}`);

    // Send the PUT request.
    $.ajax("/api/search/" + recipeTitle, {
      type: "GET"
    }).then(function (response) {
      $("#recipesBody").empty();
      console.log("empty successful");
      const element = response[0];

      // Handling ingredients list 
      const valuesIng = Object.values(element.ingredients);
      console.log("values: " + valuesIng);
      console.log(valuesIng.length);

      $(".recipesBody").data("recipe", element);
      // Append them to food list
      $("#recipesBody").append(
        `<div class="column is-one-third">
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
                
            </footer>
            </div>
        </div>

        <!-- Card two -->
        <div class="column is-one-third">
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

    <div class="column is-one-third">
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

      // Handles ingredients list
      for (let j = 0; j < valuesIng.length; j++) {
        const ing = "<li>" + valuesIng[j] + "</li>";
        $("#recList").append(
          ing
        );
      }
      console.log("test recList population successful");

      // START---  instructions listing  WORKING --------------------------------------3 
      var instructions = element.instructions;
      console.log(instructions);
   
      $("#recDirections").append(
        instructions
      );

      // let instrucDisplay="";
      // for (let k = 0; k < a1.length; k++) {
      //   if (k===a1.length-1){
      //     instrucDisplay = "<li>" + a1[k] + "</li>";
      //   }
      //   instrucDisplay = "<li>" + a1[k] + ".</li>";
      //   $("#recDirections").append(
      //     instrucDisplay
      //   );
      // }
     
      // END --- instructions WORKING ----------------------------------------3
    });
  });
});
