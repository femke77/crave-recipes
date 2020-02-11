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

  $("#signupSubmit").on("submit", function(event) {
    event.preventDefault();
    if (form.valid()) {
      console.log("valid");
      return true;
    } else {
      return false;
    }
  });
});
