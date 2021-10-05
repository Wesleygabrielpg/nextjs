"use strict";
/* jshint node: true */
const { Model, DataTypes } = require('sequelize');

class Func_Hosp extends Model {
  static init(sequelize) //(connection)
  {
    super.init
      ({
        nome_func: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        hospital_id: DataTypes.INTEGER
      },
        {
          sequelize, //ou sequelize: connection
          //Conexão com o banco de dados
          tableName: 'funcHosp_tab'
        });
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id', as: 'User_FuncHosp'
    });

    this.belongsTo(models.Hospital, {
      foreignKey: 'hospital_id', as: 'Func_Hosp'
    });
  }
}

module.exports = Func_Hosp;