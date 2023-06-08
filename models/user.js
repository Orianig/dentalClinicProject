'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.belongsTo(
        models.Roles, 
        { 
          foreignKey: 'roleId' 
        });
    }
  }
  User.init({
    name: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    dni: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.ENUM,
    birthdate: DataTypes.DATEONLY,
    specialityId: DataTypes.INTEGER,
    collegiateNumber: DataTypes.STRING,
    roleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};