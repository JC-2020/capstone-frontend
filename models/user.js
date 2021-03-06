'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Project.scope('withCompleted'), {
        foreignKey: 'owner' //* User.getProjects() --> gets the projects that the user in question is owner of
      })
      User.belongsToMany(models.Project, {
        through: models.TeamMember,
        as: 'MemberProjects' //* User.getMemberProjects() --> gets the projects that the user is a team member of
      })
      User.belongsToMany(models.Skill, {
        through: 'UserSkills', //* User.getSkills() --> gives an array of the skills that the user has
      })
      User.hasMany(models.ResetPassword)
      User.hasMany(models.Comment)
      User.hasMany(models.Chat)
    }
    //* tells what we want to return
    toJSON(){
      let values = {...this.get()}
      delete values.password
      return values
    }
  };
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    title: DataTypes.STRING,
    password: DataTypes.STRING,
    profilePicture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: { exclude: ['password'] }
    },
    //* Specifically not excluding password therefore it will include it
    scopes: {
      withPassword:{
        attributes: {}
      }
    }
  });
  return User;
};