module.exports =
{
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'PoI148@1590',
  database: 'GerenciaAssinatura',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  define:
  {
    timestamps: true,
    underscored: true, // Teste1 -> Teste_1  
  }
}
