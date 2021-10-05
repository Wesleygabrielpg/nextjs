'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // O que as migrations precisam fazer se der certo
    return queryInterface.createTable('nomeHosp_tab',
      {
        id: 
        {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },

        nome_hospital:
        {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },

        created_at:
        {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at:
        {
          type: Sequelize.DATE,
          allowNull: false,
        }
      });
  },

  down: (queryInterface, Sequelize) => {
    // O que as migrations precisam fazer caso algo dê errado
    // e o que ela precisa desfazer
    return queryInterface.dropTable('nomeHosp_tab');
  }
};
