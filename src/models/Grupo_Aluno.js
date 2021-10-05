const { Model, DataTypes } = require('sequelize');

class Grupo_Aluno extends Model {
  static init(sequelize) {
    super.init(
      {
        nome_grupo: DataTypes.STRING,
        turma: DataTypes.STRING,
        user_id: DataTypes.INTEGER,

      },
      {
        sequelize,
        tableName: "grupo_tab", //Nome da tabela no banco
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
        foreignKey: 'user_id', as: 'Dono_Grupo'
      });

    this.belongsToMany(models.Aluno, {
      foreignKey: 'grupo_id',
      through: 'aluno_grupo_association', as: 'Aluno_Grupo'  // Nome da tabela q vai ser salva a associação caso fosse N para N
    });

    this.belongsToMany(models.Rodizio, {
      foreignKey: 'grupo_id',
      through: 'rodizio_grupo_association', as: 'Grupo_Rodizio'  // Nome da tabela q vai ser salva a associação caso fosse N para N
    });


  }

}

module.exports = Grupo_Aluno;