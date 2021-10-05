'use strict';

const sequelize = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // O que as migrations precisam fazer se der certo
    return queryInterface.createTable('rodizio_tab', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      turma: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      tipo_rodizio: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      disciplina: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      
      hospital: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      rodizio_numero: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      data_inicio:
      {
        type: Sequelize.STRING,
        allowNull: false,
      },

      data_fim:
      {
        type: Sequelize.STRING,
        allowNull: false,
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
    return queryInterface.dropTable('rodizio_tab');
  }
};
