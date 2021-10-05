// lib
const Cookie_Verifier = require('../lib/Cookie_Verifier');

// Models
const Index = require('../models/Index');

async function displayAluno(req, res) {
  const token_atual = req.cookies["x-access-token"];
  const tipo_user = Cookie_Verifier.tipoUserToken(token_atual);
  const user_id = Cookie_Verifier.userIdToken(token_atual);

  if (tipo_user === 'supervisor') {
    const alunoAll = await Index.Aluno.findAll({
      include: {
        association: 'Membro_Grupo'
      }
    });

    if (alunoAll) {
      let result = JSON.stringify(alunoAll);
      return res.send(result);
    } else {
      return res.redirect(`/user/${user_id}/rodizio/create/?error=` + encodeURIComponent('no_aluno'));
    }

  } else {
    return res.redirect('/404');
  }
}

async function displayTurma(req, res) {
  const token_atual = req.cookies["x-access-token"];
  const tipo_user = Cookie_Verifier.tipoUserToken(token_atual);

  if (tipo_user === 'supervisor') {
    const { turma } = req.body;

    const grupo = await Index.Grupo_Aluno.findAll({
      where: {
        turma: turma
      },
    });

    if (grupo) {
      let result = JSON.stringify(grupo);
      return res.send(result);
    } else {
      return res.send(result);
    }

  } else {
    return res.redirect('/404');
  }
}

async function displayHospital(req, res) {
  const token_atual = req.cookies["x-access-token"];
  const tipo_user = Cookie_Verifier.tipoUserToken(token_atual);

  if (tipo_user === 'supervisor') {

    const hospital = await Index.Nome_Hosp.findAll();

    let result = JSON.stringify(hospital);

    return res.send(result);
  } else {
    return res.redirect('/404');
  }
}

module.exports = {
  displayAluno,
  displayTurma,
  displayHospital
}