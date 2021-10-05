// Imports
const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

// Models
const Index = require('../models/Index');

// Conexão com o db
const connection = new Sequelize(dbConfig);

// Inicialização da classe
Index.User.init(connection);
Index.Aluno.init(connection);
Index.Image.init(connection);
Index.Grupo_Aluno.init(connection);
Index.Rodizio.init(connection);
Index.Hospital.init(connection);
Index.Func_Hosp.init(connection);
Index.Nome_Hosp.init(connection);


// Inicialização da associação
Index.User.associate(connection.models);
Index.Aluno.associate(connection.models);
Index.Image.associate(connection.models);
Index.Grupo_Aluno.associate(connection.models);
Index.Rodizio.associate(connection.models);
Index.Hospital.associate(connection.models);
Index.Func_Hosp.associate(connection.models);

module.exports = connection;
