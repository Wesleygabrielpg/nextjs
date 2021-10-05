'use strict';

const sequelize = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('grupo_tab', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        
      },

      nome_grupo: {
        type: Sequelize.STRING,
        allowNull: false,
        
      },

      turma:{
        type: Sequelize.STRING,
        allowNull: false,
      },

      user_id: // id de quem criou o grupo
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',

        references:
        {
          model: 'user_tab', // model = Nome da tabela no banco de dados e não da pasta models
          key: 'id',
          as: 'Dono_Grupo'
        },
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('grupo_tab');
  }
};
