"use strict";

const { Model, DataTypes } = require('sequelize')
class Image extends Model {
  static init(sequelize) {
    super.init(
      {
        nome_doc: DataTypes.STRING,
        validado: DataTypes.BOOLEAN,
        aluno_id: DataTypes.INTEGER,

        //Img
        image_url: DataTypes.STRING,
        image_type: DataTypes.STRING,
        image_name: DataTypes.STRING,

      },
      {
        sequelize,
        tableName: "image_tab", //Nome da tabela no banco
      }
    )

    
  }



  static associate(models) {
    this.belongsTo(models.Aluno,
      {
        foreignKey: 'aluno_id', as: 'created_by'// Qual a coluna na tabela aluno_tab
      })
  }
}

module.exports = Image;