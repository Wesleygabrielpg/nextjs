// Models
const Index = require('../models/Index');

// lib
const Cookie_Verifier = require('../lib/Cookie_Verifier');
const fnRedirectPages = require('../lib/fnRedirectPages');

// Funções
async function profileAluno(req, res) {
  const token_atual = req.cookies["x-access-token"];
  const aluno = await Cookie_Verifier.aluno_found(token_atual);

  if (!aluno) return fnRedirectPages.alunoNull(res);

  const user = await aluno.getUser();
  const aluno_img = await aluno.getCreated_by();
  const rodizioAluno = await aluno.getRodizio_Aluno({
    where: {
      turma: aluno.turma,
      tipo_rodizio: 'individual'
    }
  });

  const Grupos = await Index.Grupo_Aluno.findAll({
    where: {
      turma: aluno.turma,
      '$Aluno_Grupo.aluno_grupo_association.aluno_id$': aluno.id
    },
    include: {
      association: 'Aluno_Grupo',
      required: true,
    }
  }).catch((error) => { return fnRedirectPages.render500(res, error); });

  let grupoID = null;
  if (Grupos) {
    Grupos.forEach(async (values) => {
      grupoID = values.id;
      return grupoID;
    });
  }

  const membrosGrupos = await Index.Aluno.findAll({
    where: {
      turma: aluno.turma,
      '$Membro_Grupo.aluno_grupo_association.grupo_id$': grupoID
    },
    include: {
      association: 'Membro_Grupo',
      required: true
    }
  }).catch((error) => { return fnRedirectPages.render500(res, error); });

  const rodizioGrupo = await Index.Rodizio.findAll({
    where: {
      turma: aluno.turma
    },
    include: {
      association: 'Rodizio_Grupo',
      through: {
        where: {
          grupo_id: grupoID,
        }
      },
      required: true,
    }
  }).catch((error) => { return fnRedirectPages.render500(res, error); });


  const promiser = await Promise.all([
    aluno, //0
    user, // 1
    Grupos, // 2
    membrosGrupos, // 3
    rodizioGrupo, // 4
    rodizioAluno, // 5
    aluno_img // 6
  ]).then(alunoInfo => {
    return alunoInfo;
  }).catch((error) => { return fnRedirectPages.render500(res, error); });

  try {
    res.render('index_Aluno', {
      aluno: promiser[0],
      user: promiser[1],
      grupoInfo: promiser[2],
      membros: promiser[3],
      rodizioGrupo: promiser[4],
      rodizioAluno: promiser[5],
      alunoDocs: promiser[6],
      grupoID: grupoID,
      res: res
    });
  } catch (error) {
    return fnRedirectPages.render500(res, error);
  }




}

async function showEditProfileAl(req, res) {
  const token_atual = req.cookies["x-access-token"];
  const aluno = await Cookie_Verifier.aluno_found(token_atual);

  if (!aluno) return fnRedirectPages.alunoNull(res);

  const user = await aluno.getUser();

  return fnRedirectPages.renderEditProfileAl(res, [aluno, user]);
}

async function profileSuper(req, res) {
  const token_atual = req.cookies["x-access-token"];
  const tipo_user = Cookie_Verifier.tipoUserToken(token_atual);
  //const aluno = await Cookie_Verifier.aluno_found(token_atual);

  if (tipo_user === 'supervisor') {
    res.render('index_Supervisor');
  } else {
    return res.redirect('/404');
  }
}

async function profileHospital(req, res) {
  const token_atual = req.cookies["x-access-token"];
  const hospital = await Cookie_Verifier.hospital_found(token_atual);

  if (!hospital) return fnRedirectPages.hospitalNull(res);

  const hospUser = await hospital.getUser_Hosp();

  const hospFuncs = await hospital.getFunc_Hosp({
    include: {
      association: 'User_FuncHosp'
    }
  });

  res.render('index_Hospital', {
    hospUser: hospUser,
    hospInfo: hospital,
    hospFuncs: hospFuncs,
  });
}

async function showEditProfileHo(req, res) {
  const token_atual = req.cookies["x-access-token"];
  const hospital = await Cookie_Verifier.hospital_found(token_atual);

  if (!hospital) return fnRedirectPages.hospitalNull(res);

  const user = await hospital.getUser_Hosp();

  return fnRedirectPages.renderEditProfileHo(res, [hospital, user]);
}

async function profileFuncionario(req, res) {
  const token_atual = req.cookies["x-access-token"];
  const funcionario = await Cookie_Verifier.func_found(token_atual);

  if (!funcionario) return fnRedirectPages.userNull(res);

  const userInfo = await funcionario.getUser_FuncHosp();
  const hospInfo = await funcionario.getFunc_Hosp({
    include: {
      association: 'User_Hosp'
    }
  });

  res.render('index_Funcionario', {
    funcInfo: funcionario,
    userInfo: userInfo,
    hospInfo: hospInfo
  });
}

async function showEditAlunoTurma(req, res) {
  const token_atual = req.cookies["x-access-token"];
  const tipo_user = Cookie_Verifier.tipoUserToken(token_atual);

  if (tipo_user === 'supervisor') {
    const aluno = await Index.Aluno.findAll();

    res.render('EditAlunoTurma.html', {
      aluno: aluno
    });

  } else {
    return res.redirect('/404');
  }
}

async function updateAluno(req, res, next) {
  const token_atual = req.cookies["x-access-token"];
  const aluno = await Cookie_Verifier.aluno_found(token_atual);

  if (!aluno) return fnRedirectPages.alunoNull(res);

  const conta_aluno = aluno.tipo_user;

  try {
    const { email, password_atual, password } = req.body;

    const user = await Index.User.findByPk(aluno.user_id)
      .catch((error) => { return fnRedirectPages.render500(res, error); });

    await user.update({
      default: false,
    }, {
      where: {}
    });

    await aluno.update({
      default: false,
    }, {
      where: {}
    });

    if (email) {
      const emailExists = await Index.User.findOne({
        where: { email: email }
      }).catch((error) => { return fnRedirectPages.render500(res, error); });

      if (emailExists) {
        return next(res.redirect(`/user/editProfileAl?error=` + encodeURIComponent('email_exist')));
      } else {

        const userup_email = await user.update({
          default: true,
          email: email,
        }, {
          where: {
            aluno_id: aluno.id
          }
        });

        if (userup_email) {
          return res.redirect('/user/editProfileAl?success=' + encodeURIComponent('success_alter'));
        } else {
          let error = `Infelizmente, deu alguma coisa errada durante a alteração do email do user ${user.id}. É tudo o que eu sei.`;
          return fnRedirectPages.render500(res, error);
        }
      }

    } else if (password) {
      const validPassword = await user.comparePassword(password_atual, user.password);
      const samepassword = await user.comparePassword(password, user.password);

      if (samepassword) {
        return next(res.redirect(`/user/editProfileAl?error=` + encodeURIComponent('mesma_senha')));
      }

      if (validPassword) {
        const userup_pass = await user.update({
          default: true,
          password: password,
        }, {
          where: {
            aluno_id: aluno.id
          }
        });

        if (userup_pass) {
          return res.redirect(`/user/editProfileAl?success=` + encodeURIComponent('success_alter'));
        } else {
          let error = `Infelizmente, deu alguma coisa errada durante a alteração da senha do user ${user.id}. É tudo o que eu sei.`;
          console.log(error);
          return res.redirect(`/user/editProfileAl?error=` + encodeURIComponent('rror_alter'));

        }

      } else {
        return next(res.redirect(`/user/editProfileAl?error=` + encodeURIComponent('senha_incorreta')));
      }

    }
  } catch (error) {
    return fnRedirectPages.render500(res, error);
  }
}

async function updateHospital(req, res, next) {
  const token_atual = req.cookies["x-access-token"];
  const hospital = await Cookie_Verifier.hospital_found(token_atual);

  if (!hospital) return fnRedirectPages.hospitalNull(res);

  try {
    const {
      endereco,
      bairro,
      numero,
      telefone,
      email,
      password_atual,
      password
    } = req.body;

    const user = await Index.User.findByPk(hospital.user_id)
      .catch((error) => { return fnRedirectPages.render500(res, error); });

    await user.update({
      default: false,
    }, {
      where: {}
    });

    await hospital.update({
      default: false,
    }, {
      where: {}
    });

    if (email) {
      const emailExists = await Index.User.findOne({
        where: { email: email }
      }).catch((error) => { return fnRedirectPages.render500(res, error); });

      if (emailExists) {
        return res.redirect(`/user/editProfileHo?error=` + encodeURIComponent('email_exist'));
      } else {
        const hospEmailUp = await user.update({
          default: true,
          email: email,
        }, {
          where: {
            hospital_id: hospital.id
          }
        });

        if (hospEmailUp) {
          return res.redirect('/user/editProfileHo?success=' + encodeURIComponent('success_alter'));
        } else {
          let error = `Infelizmente, deu alguma coisa errada durante a alteração do email do user ${user.id}. É tudo o que eu sei.`;
          console.log(error);
          return res.redirect('/user/editProfileHo?error=' + encodeURIComponent('error_alter'));

        }
      }

    } else if (password) {
      const validPassword = await user.comparePassword(password_atual, user.password);
      const samepassword = await user.comparePassword(password, user.password);

      if (samepassword) {
        return res.redirect(`/user/editProfileHo?error=` + encodeURIComponent('mesma_senha'));
      }

      if (validPassword) {
        const hospPassUp = await user.update({
          default: true,
          password: password,
        }, {
          where: {
            hospital_id: hospital.id
          }
        });

        if (hospPassUp) {
          return res.redirect('/user/editProfileHo?success=' + encodeURIComponent('success_alter'));
        } else {
          let error = `Infelizmente, deu alguma coisa errada durante a alteração da senha do user ${user.id}. É tudo o que eu sei.`;
          console.log(error);
          return next(res.redirect(`/user/editProfileHo?error=` + encodeURIComponent('error_alter')));
        }
      } else {
        return next(res.redirect(`/user/editProfileHo?error=` + encodeURIComponent('senha_incorreta')));
      }

    } else if (endereco && bairro && numero && telefone) {

      const hospCadUp = await hospital.update({
        default: true,
        endereco: endereco,
        bairro: bairro,
        numero: numero,
        telefone: telefone
      }, {
        where: {
          hospital_id: hospital.id
        }
      });

      if (hospCadUp) {
        return res.redirect('/user/editProfileHo?success=' + encodeURIComponent('success_alter'));

      } else {
        return res.redirect('/user/editProfileHo?error=' + encodeURIComponent('error_alter'));
      }

    } else if (endereco && bairro && numero) {
      const hospCadUp = await hospital.update({
        default: true,
        endereco: endereco,
        bairro: bairro,
        numero: numero
      }, {
        where: {
          hospital_id: hospital.id
        }
      });

      if (hospCadUp) {
        return res.redirect('/user/editProfileHo?success=' + encodeURIComponent('success_alter'));

      } else {
        return res.redirect('/user/editProfileHo?error=' + encodeURIComponent('error_alter'));
      }
    } else if (telefone) {
      const hospTelUp = await hospital.update({
        default: true,
        telefone: telefone,
      }, {
        where: {
          hospital_id: hospital.id
        }
      });

      if (hospTelUp) {
        return res.redirect('/user/editProfileHo?success=' + encodeURIComponent('success_alter'));

      } else {
        return res.redirect('/user/editProfileHo?error=' + encodeURIComponent('error_alter'));
      }

    } else {
      return res.redirect(`/user/editProfileHo?error=` + encodeURIComponent('campo_vazio'));
    }

  } catch (error) {
    return fnRedirectPages.render500(res, error);
  }
}

async function updateAlunoTurma(req, res) {
  const token_atual = req.cookies["x-access-token"];
  const tipo_user = Cookie_Verifier.tipoUserToken(token_atual);

  if (tipo_user === 'supervisor') {
    const { alunoSelect, turma } = req.body;

    const aluno = await Index.Aluno.findByPk(alunoSelect)
      .catch((error) => { return fnRedirectPages.render500(res, error); });

    await aluno.update({
      default: false,
    }, {
      where: {}
    });
    if (turma) {
      await aluno.update({
        default: true,
        turma: turma,
        livre: true
      }, {
        where: {
          id: aluno.id
        }
      });
      return res.redirect('/user/aluno/turma?success=' + encodeURIComponent('updAluno'));
    }

  } else {
    return res.redirect('/404');
  }
}

module.exports = {
  profileAluno,
  profileSuper,
  profileHospital,
  profileFuncionario,
  showEditProfileAl,
  showEditProfileHo,
  showEditAlunoTurma,
  updateAluno,
  updateHospital,
  updateAlunoTurma

}