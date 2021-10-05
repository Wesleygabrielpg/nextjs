// Models
const Index = require('../models');

/////////// TWILIGHT ZONE
function render500(res, error) {
  console.error("Error:", error);
  return res.render('500');
}

function render404(res, error) {
  console.log("Error: ", error);
  return res.render('404');
}

function userNull(res) {
  let error = new Error('Este user não existe!');
  return render500(res, error);
}

function alunoNull(res) {
  let error = new Error('Este aluno não existe!');
  return render500(res, error);
}

function hospitalNull(res) {
  let error = new Error('Este hospital não existe!');
  return render500(res, error);
}
///////////// TWILIGHT ZONE

function redirectUser(res, user, pathRedirect) {
  let path = pathRedirect.toString();

  if (typeof user === "number") {
    return res.redirect(`/user/${user}/${path}`);
  }

  if (user.user_id === undefined) {
    return res.redirect(`/user/${user.aluno_id}/${path}`);
  } else if (user.aluno_id === undefined) {
    return res.redirect(`/user/${user.user_id}/${path}`);
  } else {
    return res.redirect(`/user/${user.id}/${path}`);
  }

}

function renderDisplayDocs(res, file) {
  if (file != '') {
    res.render('Display_Docs', {
      file: file,
      res: res
    });
  } else {
    res.render('Display_Docs', {
      file: '',
      res: res
    });
  }
}

function renderAddMembro(res, options) {
  if (options == '') {
    res.render('Membro_Add', {
      grupo: '',
      aluno: '',
      turma: '',
      res: res
    });
  } else {
    res.render('Membro_Add', {
      grupo: options[0], // grupoDono
      aluno: options[1], // aluno
      turma: options[2],
      res: res
    });
  }
}

function renderRemoveMembro(res, options) {
  if (options == '') {
    res.render('Membro_Remove', {
      grupo: '',
      aluno: '',
      turma: '',
      nomeGrupo: '',
      res: res
    });
  } else {
    res.render('Membro_Remove', {
      grupo: options[0],
      aluno: options[1],
      turma: options[2],
      nomeGrupo: options[3],
      res: res
    });
  }
}

function renderCadastroAluno(req, res) {
  res.render('cadastro_Aluno');
}

async function renderCadastroHospital(req, res) {
  const hospAll = await Index.Nome_Hosp.findAll();

  res.render('cadastro_Hospital', {
    hospital: hospAll
  });
}

function renderEditProfileAl(res, options) {
  res.render('edit-profile-aluno', {
    aluno: options[0],
    user: options[1],
  });
}

function renderEditProfileHo(res, options) {
  res.render('edit-profile-hospital', {
    hospital: options[0],
    user: options[1]
  });
}

module.exports = {
  redirectUser,
  userNull,
  alunoNull,
  hospitalNull,
  render500,
  render404,
  renderDisplayDocs,
  renderAddMembro,
  renderRemoveMembro,
  renderCadastroAluno,
  renderCadastroHospital,
  renderEditProfileAl,
  renderEditProfileHo
};