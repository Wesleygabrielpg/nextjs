// Imports
const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const { isEmpty } = require('underscore');

// lib
const Cookie_Verifier = require('../lib/Cookie_Verifier');
const fnRedirectPages = require('../lib/fnRedirectPages');

// Models
const Index = require('../models/Index');

// Criação do grupo
const storeGrupo = async (req, res, next) => {
  const token_atual = req.cookies["x-access-token"];
  const user_id = await Cookie_Verifier.userIdToken(token_atual);

  if (!user_id) return fnRedirectPages.userNull(res);

  const tipo_user = await Cookie_Verifier.tipoUserToken(token_atual);

  if (tipo_user == 'supervisor') {
    const { nome_grupo, turma } = req.body;

    const grupo = await Index.Grupo_Aluno.create({
      nome_grupo: nome_grupo,
      turma: turma,
      user_id: user_id,
    }).catch((error) => { return fnRedirectPages.render500(res, error); });

    if (grupo) {
      return res.redirect('/user/grupo/create');
    } else {
      let error = new Error('Alguma coisa deu errado na hora de criar o grupo.');
      console.log(error);
      return res.redirect('/user/grupo/create/?error= ' + encodeURIComponent('error_addGrupo'));
    }

  } else {
    return fnRedirectPages.redirectUser(res, user, '404');
  }
};

const storeMembro = async (req, res, next) => {
  const token_atual = req.cookies["x-access-token"];
  const tipo_user = await Cookie_Verifier.tipoUserToken(token_atual);
  const user_id = Cookie_Verifier.userIdToken(token_atual);

  if (tipo_user == 'supervisor') {
    const { grupoSelected, aluno_checkbox } = req.body;
    let sucesso = false;

    if (!aluno_checkbox) {
      return res.redirect(`/user/grupo/add/?error=` + encodeURIComponent('no_aluno'));
    }

    const novoMembro = await Index.Aluno.findAll({
      where: {
        id: aluno_checkbox,
        livre: true
      },
      include: {
        association: 'Membro_Grupo',
        required: false
      }
    });

    let alunoID = [];
    let alunoTurma;

    novoMembro.forEach((value) => {
      alunoID.push(value.id);
      alunoTurma = value.turma;
    });

    let grupoSelecionado;
    if (alunoTurma) {
      grupoSelecionado = await Index.Grupo_Aluno.findOne({
        where: {
          id: grupoSelected,
          turma: alunoTurma
        }
      });
    } else {
      let result = JSON.stringify(sucesso);
      return res.send(result);
    }


    const promiser = await Promise.all([
      novoMembro,
      grupoSelecionado
    ]).then((data) => {
      return data;
    }).catch(error => { return fnRedirectPages.render500(res, error); });

    let membro = promiser[0];
    let grupo = promiser[1];

    if (membro && grupo) {
      alunoID.forEach(async (value) => {
        await grupo.addAluno_Grupo(value);
        membro.livre = false;

        membro.forEach(async (value) => {
          value.livre = false;
          await value.save();
        });
      });

      sucesso = true;
      let result = JSON.stringify(sucesso);
      return res.send(result);
      //return res.redirect(`/user/grupo/add/?success=` + encodeURIComponent('addMembro'));
    } else {
      let error = new Error('O aluno/grupo selecionado não existe.');
      console.log(error);
      return res.redirect(`/user/grupo/add/`);

    }
  } else {
    return res.redirect(`/user/grupo/add/`);
  }

};

const addMembroWindow = async (req, res, next) => {
  const token_atual = req.cookies["x-access-token"];
  const tipo_user = Cookie_Verifier.tipoUserToken(token_atual);
  const user_id = Cookie_Verifier.userIdToken(token_atual);
  const user = await Index.User.findByPk(user_id);

  if (!user) return fnRedirectPages.userNull(res);

  if (tipo_user == 'supervisor') {
    res.render('Membro_Add');

  } else {
    return res.redirect('/404');
  }
};

const removeMembro = async (req, res, next) => {
  const token_atual = req.cookies["x-access-token"];
  const tipo_user = Cookie_Verifier.tipoUserToken(token_atual);
  const user_id = Cookie_Verifier.userIdToken(token_atual);
  const user = await Index.User.findByPk(user_id);

  if (!user) return fnRedirectPages.userNull(res);

  if (tipo_user === 'supervisor') {
    const { grupoSelected, aluno_checkbox } = req.body;

    if(!aluno_checkbox){
      
    }
    
    let sucesso = false;
    let grupoID = parseInt(grupoSelected);

    const aluno = await Index.Aluno.findAll({
      where: {
        id: aluno_checkbox
      },
      include: {
        association: 'Membro_Grupo',
        required: true
      }
    });

    let alGrupo = [];
    aluno.forEach((al) => {
      alGrupo.push(al.Membro_Grupo);
    });

    let grupoAl = [];
    alGrupo.forEach((gru) => {
      gru.forEach((val) => {
        grupoAl.push(val.id);
      });
    });
    
    console.log(grupoAl);

    try {
      if (grupoAl.includes(grupoID)) {
        //await grupo.removeAluno_Grupo(aluno_checkbox);
        aluno.forEach((al) => {
          al.update({ livre: true });
        });

        sucesso = true;
        let result = JSON.stringify(sucesso);
        return res.send(result);
      } else {
        let result = JSON.stringify(sucesso);
        return res.send(result);
      }


      //return res.redirect(`/user/grupo/remove`);
    } catch (error) {
      return fnRedirectPages.render500(res, error);
    }
  } else {
    return res.redirect('/404');
  }

};

async function renderRemoveMembro(req, res) {
  const token_atual = req.cookies["x-access-token"];
  const tipo_user = Cookie_Verifier.tipoUserToken(token_atual);
  const user_id = Cookie_Verifier.userIdToken(token_atual);
  const user = await Index.User.findByPk(user_id);

  if (!user) return fnRedirectPages.userNull(res);

  if (tipo_user == 'supervisor') {
    res.render('Membro_Remove');

  } else {
    return res.redirect('/404');
  }
}

async function delGrupoWindow(req, res, next) {
  const token_atual = req.cookies["x-access-token"];
  const aluno = await Cookie_Verifier.aluno_found(token_atual);

  if (!aluno) return fnRedirectPages.alunoNull(res);

  const grupo = await Index.Grupo_Aluno.findOne({
    where: {
      aluno_id: aluno.id
    }
  });

  const grupoDono = await aluno.getDono_Grupo();
  let grupoDonoID;

  if (grupoDono !== null) {
    grupoDono.forEach((value) => {
      grupoDonoID = value.id;
    });
  }

  if (!isEmpty(grupoDono)) {
    await grupo.destroy(grupoDonoID);
    await grupo.save();

    return fnRedirectPages.redirectUser(res, aluno, 'index_Aluno');
  } else {
    return fnRedirectPages.redirectUser(res, aluno, 'grupo/create');
  }

}

module.exports = {
  storeGrupo,
  addMembroWindow,
  storeMembro,
  removeMembro,
  delGrupoWindow,
  renderRemoveMembro
};