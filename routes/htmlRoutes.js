var express = require("express");
var router = express.Router();
var db = require("../models");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {   
    return next();
  }
  res.redirect("/");
}

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/dashboard", isLoggedIn, function(req, res) {

  res.render("dashboard", {name: req.user, loggedIn: true});
});


//on landing page, render the index.hbs file with x number of random recipes from the db
router.get("/", (req, res) => {

  db.Recipe.findAll({
    order: db.sequelize.random(),
    limit: 12
  }).then(function(recipes) {

    res.render("index", {recipes: recipes, loggedIn: req.isAuthenticated()});
  });
});

router.get("/full-recipe/:id", (req, res) => {
  db.Recipe.findOne({
    where: {
      id: req.params.id
    }
  }).then(function (recipe) {
    const fullRecipe = recipe.get({ plain: true });

    
    res.render("fullRecipe", {recipe: fullRecipe, loggedIn: req.isAuthenticated()});

  });
});
router.get("/create", (req, res) => {
  //show form to make a new recipe
  res.render("createRecipe", {loggedIn: req.isAuthenticated()});
});

router.get("*", (req, res) => {
  //show 404 page for all pages w/o routes
  res.render("404");
});

module.exports = router;
