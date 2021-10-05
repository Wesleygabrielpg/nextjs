'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // O que as migrations precisam fazer se der certo
    return queryInterface.createTable('aluno_tab',
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
            as: 'User',
          },
        },

        nome_completo:
        {
          type: Sequelize.STRING,
          allowNull: false,
        },

        matricula:
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true,
        },

        turma:
        {
          type: Sequelize.STRING,
          allowNull: false,
        },

        cpf:
        {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },

        livre:
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
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
    return queryInterface.dropTable('aluno_tab');
  }
};
