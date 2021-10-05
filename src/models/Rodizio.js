"use strict";

const { Model, DataTypes } = require('sequelize');

class Rodizio extends Model {
  static init(sequelize) {
    super.init(
      {
        turma: DataTypes.STRING,
        tipo_rodizio: DataTypes.STRING,
        disciplina: DataTypes.STRING,
        hospital: DataTypes.STRING,
        rodizio_numero: DataTypes.INTEGER,
        data_inicio: DataTypes.STRING,
        data_fim: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: "rodizio_tab", //Nome da tabela no banco
      }
    );
  }

  static associate(models) {
    
    this.belongsToMany(models.Grupo_Aluno, {
      foreignKey: 'rodizio_id',
      through: 'rodizio_grupo_association', as: 'Rodizio_Grupo'  // Nome da tabela q vai ser salva a associação caso fosse N para N
    });

    this.belongsToMany(models.Aluno, {
      foreignKey: 'rodizio_id',
      through: 'rodizio_aluno_association', as: 'Rodizio_Aluno'  // Nome da tabela q vai ser salva a associação caso fosse N para N
    });
  }

}

module.exports = Rodizio;