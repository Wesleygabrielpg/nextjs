"use strict";

const { Model, DataTypes } = require('sequelize');

class Nome_Hosp extends Model {
  static init(sequelize) //(connection)
  {
    super.init
      ({
        nome_hospital: DataTypes.STRING,
      },
        {
          sequelize, //ou sequelize: connection
          //Conexão com o banco de dados
          tableName: 'nomeHosp_tab'
        })
  }
}

module.exports = Nome_Hosp;