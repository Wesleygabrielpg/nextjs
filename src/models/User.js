"use strict";

const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
class User extends Model {
  static init(sequelize) {
    super.init
      ({
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        tipo_user: DataTypes.STRING,
        token_active: DataTypes.STRING,
        reset_password_token: DataTypes.STRING,
        reset_password_expires: DataTypes.DATE,
      },
        {
          sequelize,
          tableName: 'user_tab'
        }
      );

    User.beforeSave((user, options) => {
      if (user.changed('password')) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
      }
    });

    User.prototype.comparePassword = async function (passw) {
      const user = this;

      const compare = await bcrypt.compare(passw, user.password);

      return compare;
    };

    User.generatePasswordReset = function () {
      //this.reset_password_token = crypto.randomBytes(20).toString('hex');
      this.reset_password_expires = Date.now() + 3600000; //expires in an hour
    };
  }

  static associate(models) {
    this.hasOne(models.Aluno, {
      foreignKey: 'user_id', as: 'Aluno'
    });

    this.hasOne(models.Hospital, {
      foreignKey: 'user_id', as: 'Hospital'
    });

    this.hasOne(models.Func_Hosp, {
      foreignKey: 'user_id', as: 'Hospital_Funcionario'
    });

    this.hasMany(models.Grupo_Aluno, {
      foreignKey: 'user_id', as: 'Dono_Grupo'
    });
  }
}

module.exports = User;