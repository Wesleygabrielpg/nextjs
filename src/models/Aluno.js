"use strict";

const { Model, DataTypes } = require('sequelize');
class Aluno extends Model {
  static init(sequelize) //(connection)
  {
    super.init
      ({
        nome_completo: DataTypes.STRING,
        turma: DataTypes.STRING,
        matricula: DataTypes.INTEGER,
        cpf: DataTypes.INTEGER,
        livre: DataTypes.BOOLEAN

      },
        {
          sequelize, //ou sequelize: connection
          //Conexão com o banco de dados
          tableName: 'aluno_tab'
        })
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id', as: 'User'
    });

    this.hasMany(models.Image, {
      foreignKey: 'aluno_id', as: 'created_by'
    });

    this.belongsToMany(models.Grupo_Aluno, {
      foreignKey: 'aluno_id',
      through: 'aluno_grupo_association', as: 'Membro_Grupo' // Nome da tabela q vai ser salva a associação caso fosse N para N
    });

    this.belongsToMany(models.Rodizio, {
      foreignKey: 'aluno_id',
      through: 'rodizio_aluno_association', as: 'Rodizio_Aluno'  // Nome da tabela q vai ser salva a associação caso fosse N para N
    });

  }
}

module.exports = Aluno;