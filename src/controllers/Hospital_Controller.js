// models
const Index = require('../models/Index');

// lib
const Cookie_Verifier = require('../lib/Cookie_Verifier');
const fnRedirectPages = require('../lib/fnRedirectPages');

async function storeFuncionario(req, res, next) {
  const token_atual = req.cookies['x-access-token'];
  const hospital = await Cookie_Verifier.hospital_found(token_atual);

  if (!hospital) return fnRedirectPages.hospitalNull(res);

  const { email, password, nome_func } = req.body;

  const emailExists = await Index.User.findOne({
    where: { email: email }
  }).catch((error) => { return fnRedirectPages.render500(res, error); });

  try {
    if (!emailExists) {
      const user = await Index.User.create({
        email,
        password,
        tipo_user: 'funcHosp'
      }).catch((error) => { return fnRedirectPages.render500(res, error); });

      if (user) {
        const func = await Index.Func_Hosp.create({
          user_id: user.id,
          hospital_id: hospital.id,
          nome_func: nome_func
        }).catch(async (error) => {
          await user.destroy();
          console.log(error);
          return res.redirect(`/user/func?error=` + encodeURIComponent('error_cadFunc'));
        });

        if (user && func) {
          return res.redirect(`/user/func?success=` + encodeURIComponent('success_cadFunc'));
        } else {
          return res.redirect(`/user/func?error=` + encodeURIComponent('error_cadFunc'));

        }
      }
    } else {
      return res.redirect(`/user/func?error=` + encodeURIComponent('email_exist'));
    }

  } catch (error) {
    return fnRedirectPages.render500(res, error);
  }

}

async function windowFuncionarioCad(req, res, next) {
  const token_atual = req.cookies['x-access-token'];
  const hospital = await Cookie_Verifier.hospital_found(token_atual);

  if (!hospital) return fnRedirectPages.hospitalNull(res);

  res.render('Funcionario_Add');
}

async function displayRodizio(req, res, next) {
  const token_atual = req.cookies['x-access-token'];
  const tipo_user = Cookie_Verifier.tipoUserToken(token_atual);
  let hospital = null;
  let funcionario = null;

  if (tipo_user == 'adminHosp') {
    hospital = await Cookie_Verifier.hospital_found(token_atual);
    if (!hospital) return fnRedirectPages.hospitalNull(res);
  } else if (tipo_user == 'funcHosp') {
    funcionario = await Cookie_Verifier.func_found(token_atual);
    if (!funcionario) return fnRedirectPages.userNull(res);
  } else {
    return res.redirect('/404');
  }

  if (hospital && !funcionario) {
    const turma = req.query.md;

    const rodizio = await Index.Rodizio.findAll({
      where: {
        hospital: hospital.nome_hospital,
        '$Rodizio_Grupo.Aluno_Grupo.turma$': `md${turma}`
      },
      include: [{
        association: 'Rodizio_Grupo',
        required: true,
        include: {
          association: 'Aluno_Grupo',
          required: true
        }
      }]
    });

    let rodizioID = [];
    rodizio.forEach((value) => {
      rodizioID.push(value.id);
    });

    const grupoRodizio = await Index.Grupo_Aluno.findAll({
      where: {
        '$rodizio_id$': rodizioID
      },
      include: {
        association: 'Grupo_Rodizio',
        required: true
      }
    }).catch((error) => { return fnRedirectPages.render(res, error); });

    let grupoID = [];
    grupoRodizio.forEach((value) => {
      grupoID.push(value.id);
    });

    const grupo = await Index.Grupo_Aluno.findAll({
      where: {
        '$Aluno_Grupo.aluno_grupo_association.grupo_id$': grupoID,
      },
      include: {
        association: "Aluno_Grupo",
        required: true,
      }
    });

    res.render('Ver_Rodizios', {
      tipo_user: tipo_user,
      rodizio: rodizio,
      grupoMembro: grupo,
      turma: turma
    });
  } else if (!hospital && funcionario) {
    const hospital1 = await funcionario.getFunc_Hosp();
    const turma = req.query.md;

    const rodizio = await Index.Rodizio.findAll({
      where: {
        hospital: hospital1.nome_hospital,
        '$Rodizio_Grupo.Aluno_Grupo.turma$': `md${turma}`
      },
      include: [{
        association: 'Rodizio_Grupo',
        required: true,
        include: {
          association: 'Aluno_Grupo',
          required: true
        }
      }]
    });

    let rodizioID = [];
    rodizio.forEach((value) => {
      rodizioID.push(value.id);
    });

    const grupoRodizio = await Index.Grupo_Aluno.findAll({
      where: {
        '$rodizio_id$': rodizioID
      },
      include: {
        association: 'Grupo_Rodizio',
        required: true
      }
    }).catch((error) => { return fnRedirectPages.render(res, error); });

    let grupoID = [];
    grupoRodizio.forEach((value) => {
      grupoID.push(value.id);
    });

    const grupo = await Index.Grupo_Aluno.findAll({
      where: {
        '$Aluno_Grupo.aluno_grupo_association.grupo_id$': grupoID,
      },
      include: {
        association: "Aluno_Grupo",
        required: true,
      }
    });

    res.render('Ver_Rodizios', {
      tipo_user: tipo_user,
      rodizio: rodizio,
      grupoMembro: grupo,
      turma: turma
    });
  }

}

async function displayAluno(req, res, next) {
  const token_atual = req.cookies['x-access-token'];
  const tipo_user = Cookie_Verifier.tipoUserToken(token_atual);
  let hospital = null;
  let funcionario = null;

  if (tipo_user == 'adminHosp') {
    hospital = await Cookie_Verifier.hospital_found(token_atual);
    if (!hospital) return fnRedirectPages.hospitalNull(res);
  } else if (tipo_user == 'funcHosp') {
    funcionario = await Cookie_Verifier.func_found(token_atual);
    if (!funcionario) return fnRedirectPages.userNull(res);
  } else {
    return res.redirect('/404');
  }

  if (hospital || funcionario) {
    const aluno_id = req.query.id;

    const aluno = await Index.Aluno.findByPk(aluno_id);
    const user = await aluno.getUser();
    const alunoDocs = await aluno.getCreated_by();

    res.render('index_AlunoHosp', {
      tipo_user: tipo_user,
      aluno: aluno,
      user: user,
      alunoDocs: alunoDocs,
      res: res
    });
  } else {
    return res.redirect('/404');
  }
}

module.exports = {
  storeFuncionario,
  windowFuncionarioCad,
  displayRodizio,
  displayAluno
}