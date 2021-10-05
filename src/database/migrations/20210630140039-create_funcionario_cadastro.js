'use strict';
const sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // O que as migrations precisam fazer se der certo
    return queryInterface.createTable('funcHosp_tab',
      {
        id:
        {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },

        user_id:
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',

          references:
          {
            model: 'user_tab', // model = Nome da tabela no banco de dados e não da pasta models
            key: 'id',
            as: 'User_FuncHosp',
          },
        },

        hospital_id:
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',

          references:
          {
            model: 'hospital_tab', // model = Nome da tabela no banco de dados e não da pasta models
            key: 'id',
            as: 'Func_Hosp',
          },
        },

        nome_func:
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
    return queryInterface.dropTable('funcHosp_tab');
  }
};
