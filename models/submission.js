// When a user creates a recipe online the recipe is sent here until it can be cleared as acceptable
// and added to the recipe table.

module.exports = function(sequelize, DataTypes) {
  var Submission = sequelize.define("Submission", {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    servings: DataTypes.INTEGER,
    ingredients: {
      type: DataTypes.JSON,
      allowNull: false
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image: DataTypes.STRING,
    category: DataTypes.STRING,
    dishType: DataTypes.STRING,
    source: DataTypes.STRING
  });

  Submission.associate = function(models) {
    Submission.belongsTo(models.User); //fk name is UserId
  };
  return Submission;
};
