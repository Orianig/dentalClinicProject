'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    //me devuelve los datos en el workbench sin yo tener que introducirlos manualmente
    
    return queryInterface.bulkInsert('Roles', [
      {
        id: 1,
        name: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'dentist',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'patient',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'superAdmin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
