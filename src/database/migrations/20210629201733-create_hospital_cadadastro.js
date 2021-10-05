'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // O que as migrations precisam fazer se der certo
    return queryInterface.createTable('hospital_tab',
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
            as: 'User_Hosp',
          },
        },

        nome_hospital:
        {
          type: Sequelize.STRING,
          allowNull: false,
        },

        endereco:
        {
          type: Sequelize.STRING,
          allowNull: false,
        },

        numero:
        {
          type: Sequelize.STRING,
          allowNull: false,
        },

        bairro:
        {
          type: Sequelize.STRING,
          allowNull: false,
        },

        telefone:
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
    return queryInterface.dropTable('hospital_tab');
  }
};
