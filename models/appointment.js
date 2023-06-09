'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Appointment.belongsTo(models.Intervention, {
        foreignKey: 'interventionId',
        as: 'intervention'
      });
      Appointment.belongsTo(models.User, {
        foreignKey: 'patientId',
        as: 'patient'
      });
      Appointment.belongsTo(models.User, {
        foreignKey: 'dentistId',
        as: 'dentist'
      });
    }
  }

  Appointment.init({
    date: DataTypes.DATEONLY, //YYYY-MM-DD
    startTime:DataTypes.TIME, //HH:MM:SS
    endTime:DataTypes.TIME,
    interventionId: DataTypes.INTEGER,
    details: DataTypes.STRING,
    patientId: DataTypes.INTEGER,
    dentistId: DataTypes.INTEGER,
    results: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Appointment',
  });
  return Appointment;
};