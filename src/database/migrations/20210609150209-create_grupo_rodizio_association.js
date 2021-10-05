'use strict';

const sequelize = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // O que as migrations precisam fazer se der certo
    return queryInterface.createTable('rodizio_grupo_association', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      rodizio_id:
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',

        references:
        {
          model: 'rodizio_tab', // model = Nome da tabela no banco de dados e não da pasta models
          key: 'id',
          as: 'Rodizio'
        },
      },

      grupo_id:
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',

        references: { 
          model: 'grupo_tab', // model = Nome da tabela no banco de dados e não da pasta models
          key: 'id',
          as: 'Grupo_Rodizio'
        },  
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
    return queryInterface.dropTable('rodizio_grupo_association');
  }
};
