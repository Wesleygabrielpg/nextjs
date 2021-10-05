// Imports
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');

// lib
const fnRedirectPages = require('./fnRedirectPages');

// Models
const Index = require('../models/Index');

function userIdToken(token) {
  const decoded = jwt_decode(token);
  const user_id = decoded.user_id;

  return user_id;
}

function tipoUserToken(token) {
  const decode = jwt_decode(token);
  const tipo_user = decode.tipo_user;

  return tipo_user;
}

async function aluno_found(token) {
  const user_id = userIdToken(token);
  const aluno = await Index.Aluno.findOne({ where: { user_id: user_id } });

  return aluno;
}

async function hospital_found(token) {
  const user_id = userIdToken(token);
  const hospital = await Index.Hospital.findOne({ where: { user_id: user_id } });

  return hospital;
}

async function func_found(token) {
  const user_id = userIdToken(token);

  const funcionario = await Index.Func_Hosp.findOne({ where: { user_id: user_id } });

  return funcionario;
}

async function verifyJWT(req, res, next) {
  const user_token = req.cookies['x-access-token']; // vê se o user ja possui um token valido

  if (!user_token) return res.redirect('/login');

  const user_id = userIdToken(user_token);
  const user_db = await Index.User.findByPk(user_id)
    .catch((error) => {
      fnRedirectPages.render500(res, error);
    });

  if (!user_db || user_db == undefined) return res.redirect('/login?error=tokenExp');

  const token_user = user_db.token_active; // Pega o token do user salvo no banco

  if (!token_user || token_user == null) return res.redirect('/login?error=tokenExp');

  try {
    if (token_user) // Caso exista um token salvo, ele vê se esse token ainda é valido (1h de vida)
    {
      const { exp } = jwt.verify(token_user, process.env.SECRET);

      // Check if token has expired
      if (exp < Date.now().valueOf() / 1000) {
        return res.redirect('/login?error=tokenExp');
      }
      
      next();

    } else {
      next();
    }

  } catch (error) {
    return res.redirect('/login?error=tokenExp');
  }
}

module.exports = {
  userIdToken,
  tipoUserToken,
  aluno_found,
  hospital_found,
  func_found,
  verifyJWT
};