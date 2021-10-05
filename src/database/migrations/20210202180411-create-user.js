'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // O que as migrations precisam fazer se der certo
    return queryInterface.createTable('user_tab',
      {
        id:
        {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },

        email:
        {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },

        password:
        {
          type: Sequelize.STRING,
          allowNull: false,
        },

        tipo_user:
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: "aluno",
        },

        token_active:
        {
          type: Sequelize.STRING
        },

        reset_password_token: {
          type: Sequelize.STRING,
          required: false,
          unique: true
        },

        reset_password_expires: {
          type: Sequelize.DATE,
          required: false
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
    return queryInterface.dropTable('user_tab');
  }
};
