'use strict';

const sequelize = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('image_tab', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      nome_doc: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      validado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      aluno_id:
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',

        references:
        {
          model: 'aluno_tab', // model = Nome da Tabela no banco de dados e não da pasta models
          key: 'id',
          as: 'Created_by'
        },
      },

      /* ########## Imagem info ##########*/
      image_url: {
        type: Sequelize.STRING
      },
      image_type: {
        type: Sequelize.STRING
      },
      image_name: {
        type: Sequelize.STRING
      },

      /* ########## Imagem ##########*/

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
    await queryInterface.dropTable('image_tab');
  }
};
