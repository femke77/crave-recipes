/* eslint-disable prettier/prettier */
//api routing
var express = require("express");

var router = express.Router();

var db = require("../models");

const { Op } = require("sequelize");

//Post a new recipe to the database in the submission table
router.post("/api/submission", (req, res) => {
  if (!req.body) {
    res.status("400").send("req body is required.");
    return;
  }
  db.Submission.create(req.body).then(function () {
    res.status(200).end();
  });
});

// Get user information
router.get("/api/user", (req, res) => {
  res.json(req.user)
})

router.post("/api/newrecipe", (req,res)=> {
  db.Recipe.create(req.body).then(function() {
    res.status(201).end();
  })
})
//Unsaving or unfavoriting a recipe
router.delete("/api/saved/:userId/:recipeId", (req, res) => {
  db.User.findOne({
    where: {
      id: req.params.userId
    }
  }).then(function(user){
    user.removeSave(req.params.recipeId);
  }).then(function(){
    res.status(200).send("save removed");
  });
});

//gets the recipes saved by the user using the user id
router.get("/api/saved/:userId", (req, res) => { 
  db.User.findOne({
    where: {
      id: req.params.userId
    }
  })
    .then(function (user) {
      return user.getSaves();
    })
    .then(function (recipes) {
      res.json(recipes);
    });
});

//saves the recipeid and userid into the save table as a favorite
router.post("/api/save/:userId/:recipeId", (req, res) => {
  db.User.findOne({
    where: {
      id: req.params.userId
    }
  }).then(function(user) {
    user.addSaves(req.params.recipeId);
    res.status(200).send("save was successful");
  });
});

//return recipe with the requested id
router.get("/api/recipe/:id", (req, res) => {
  db.Recipe.findOne({
    where: {
      id: req.params.id
    }
  }).then(function (recipe) {
    res.json(recipe);
  });
});

//insert or update a note
router.put("/api/note", (req, res) => {
  db.Note.upsert({
    note: req.body.note,
    RecipeId: req.body.RecipeId,
    UserId: req.body.UserId
  }).then(function (result) {
    if (result) {
      res.status(200).send("successfully updated");
    } else {
      res.status(200).send("successfully stored");
    }
  });
});

//get a recipe with note
router.get("/api/recipe-detailed/:recipeId", (req, res) => {
  db.Recipe.findOne({
    where: {
      id: req.params.recipeId
    },
    include : [{
      model: db.Note,
    }]
  }).then(function(recipeWithNote){
    res.json(recipeWithNote);
  });
});

//delete a note by id 
router.delete("/api/note/:id", (req, res) => {
  db.Note.destroy({
    where: {
      id: req.params.id
    }
  }).then(function () {
    res.status(200).send("note deleted");
  });
});

//delete a note with userId and recipeId. Used whenr removing save
router.delete("/api/note/:userId/:recipeId", (req, res) => {
  db.Note.destroy({
    where: {
      [Op.and]: [
        {
          RecipeId: req.params.recipeId
        },
        {
          UserId: req.params.userId
        }
      ]
    }
  }).then(function(){
    res.status("200").send("note deleted");
  });
});


//find a note by its id 
router.get("/api/note/:id", (req, res) => {
  db.Note.findOne({
    where: {
      id: req.params.id
    }
  }).then(function (note) {
    res.json(note);    
  });
});

//get note by recipeId and userId
router.get("/api/note/:recipeId/:userId", (req, res) => {
  db.Note.findOne({
    where: {
      [Op.and]: [
        {
          RecipeId: req.params.recipeId
        },
        {
          UserId: req.params.userId
        }
      ]
    }
  }).then(function (note) {
    res.json(note);
  });
});


//The main form of searching the database - user enters a keyword and function returns
//all hits that match category (cuisine type) or keyword as substring anywhere in title
router.get("/api/search/:keyword", (req, res) => {
  var keyword = "%" + req.params.keyword + "%";

  db.Recipe.findAll({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: keyword
          }
        },
        {
          category: {
            [Op.like]: keyword
          }
        }
      ]
    }
  }).then(function (recipes) {
    res.json(recipes);
  });
});

module.exports = router;
