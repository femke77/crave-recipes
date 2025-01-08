$(document).ready(function() {
  //add jquery validation
  $("#dash").hide();
  $("#logout").hide();

  $("#cancel").on("click", function() {
    console.log("you clicked on me");
    window.location.href = "/";
    return false;
  });

  var form = $("#signup");
  form.validate({
    errorClass: "error-class",
    validClass: "valid-class",
    rules: {
      email: "required",
      firstname: "required",
      lastname: "required",
      username: "required",
      password: "required"
    },
    messages: {
      email: "Email address is required.",
      firstname: "First name is required",
      lastname: "Last name is required",
      username: "Username is required",
      password: "Password of at least 6 characters is required"
    }
  });

  $("#signup").on("submit", function(event) {
    event.preventDefault();
    console.log("submit clicked");
    
    if (form.valid()) {
      console.log("valid");
      $.post("/api/signup", {
        email: $("#email").val().trim(),
        firstname: $("#firstname").val().trim(),
        lastname: $("#lastname").val().trim(),
        username: $("#username").val().trim(),
        password: $("#password").val().trim()
      }).then(function() {
        window.location.replace("/dashboard");
      });

      return true;
    } else {
      return false;
    }
  });
});
