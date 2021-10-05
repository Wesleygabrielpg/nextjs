"use strict";
/* jshint node: true */
const { Model, DataTypes } = require('sequelize');

class Hospital extends Model {
  static init(sequelize) //(connection)
  {
    super.init
      ({
        nome_hospital: DataTypes.STRING,
        endereco: DataTypes.STRING,
        bairro: DataTypes.STRING,
        numero: DataTypes.STRING,
        telefone: DataTypes.INTEGER,

      },
        {
          sequelize, //ou sequelize: connection
          //Conexão com o banco de dados
          tableName: 'hospital_tab'
        })
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id', as: 'User_Hosp'
    });

    this.hasMany(models.Func_Hosp, {
      foreignKey: 'hospital_id', as: 'Func_Hosp'
    });
  }
}

module.exports = Hospital;