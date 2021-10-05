'use strict';

const sequelize = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // O que as migrations precisam fazer se der certo
    return queryInterface.createTable('aluno_grupo_association', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      aluno_id:
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',

        references:
        {
          model: 'aluno_tab', // model = Nome da tabela no banco de dados e não da pasta models
          key: 'id',
          as: 'Membro'
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
          as: 'Grupo'
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
    return queryInterface.dropTable('aluno_grupo_association');
  }
};
