// lib
const Cookie_Verifier = require('../lib/Cookie_Verifier');
const fnRedirectPages = require('../lib/fnRedirectPages');

// Models
const Index = require('../models/Index');

function formatterDisciplina(disciplina) {
  let disciplinaList = [
    'clinicaMedica',
    'clinicaCirurgica',
    'pediatria',
    'ginecologiaObstetricia',
    'urgenciaEmergencia',
    'saudeMentalIdoso',
    'clinicaEspecializada',
    'saudeColetiva',
    'saudeRural'
  ];

  if (disciplinaList.includes(disciplina)) {
    if (disciplina == 'clinicaMedica') {
      disciplina = 'Clínica Médica';
      return disciplina;
    }

    if (disciplina == 'clinicaCirurgica') {
      disciplina = 'Clínica Cirúrgica';
      return disciplina;
    }

    if (disciplina == 'pediatria') {
      disciplina = 'Pediatria';
      return disciplina;
    }

    if (disciplina == 'ginecologiaObstetricia') {
      disciplina = 'Ginecologia e Obstetrícia';
      return disciplina;
    }

    if (disciplina == 'urgenciaEmergencia') {
      disciplina = 'Urgência e Emergência';
      return disciplina;
    }

    if (disciplina == 'saudeMentalIdoso') {
      disciplina = 'Saúde mental e do Idoso';
      return disciplina;
    }
    if (disciplina == 'pediatria') {
      disciplina = 'Pediatria';
      return disciplina;
    }

    if (disciplina == 'clinicaEspecializada') {
      disciplina = 'Clínicas Especializadas';
      return disciplina;
    }
    if (disciplina == 'saudeColetiva') {
      disciplina = 'Saúde Coletiva';
      return disciplina;
    }

    if (disciplina == 'saudeRural') {
      disciplina = 'Saúde Rural';
      return disciplina;
    }
  }
}


async function storeRodizioGrupo(req, res) {
  const token_atual = req.cookies["x-access-token"];
  const user_id = Cookie_Verifier.userIdToken(token_atual);
  const user = await Index.User.findByPk(user_id);

  if (!user) return fnRedirectPages.userNull(res);

  const tipo_user = Cookie_Verifier.tipoUserToken(token_atual);

  if (tipo_user === 'supervisor') {
    const {
      turmaSelected,
      grupoSelected,
      discSelected,
      hospitalSelected,
      rodizio_numero,
      data_inicio,
      data_fim,
    } = req.body;

    let splitDisciplina = discSelected.toString().split(",");
    let splitHospital = hospitalSelected.toString().split(",");

    let disciplinaFormatada = [];
    for (let index = 0; index < splitDisciplina.length; index++) {
      disciplinaFormatada.push(formatterDisciplina(splitDisciplina[index]));
    }

    let hospitalFormatado = [];
    for (let index = 0; index < splitHospital.length; index++) {
      hospitalFormatado.push(splitHospital[index]);
    }

    if (!disciplinaFormatada) {
      let error = new Error('Esta disciplina não existe na função formatterDisciplina!');
      return fnRedirectPages.render500(res, error);
    }

    if (grupoSelected) {
      const grupo = await Index.Grupo_Aluno.findOne({
        where: {
          nome_grupo: grupoSelected,
          turma: turmaSelected
        },
        include: {
          association: 'Aluno_Grupo',
          required: true
        }
      }).catch((error) => {
        console.log(error);
        return res.redirect(`/user/rodizio/create/grupo?error=` + encodeURIComponent('no_grupo'));
      });


      if (grupo) {
        let grupoMembros = [];

        grupo.Aluno_Grupo.forEach((value) => {
          grupoMembros.push(value);
        });

        for (let index = 0; index < disciplinaFormatada.length; index++) {
          const rodizio = await Index.Rodizio.bulkCreate([{
            turma: turmaSelected,
            tipo_rodizio: 'grupo',
            disciplina: disciplinaFormatada[index],
            hospital: hospitalSelected,
            rodizio_numero: parseInt(rodizio_numero[index]),
            data_inicio: data_inicio,
            data_fim: data_fim
          }]).catch((error) => {
            console.log(error);
            return res.redirect(`/user/rodizio/create/grupo?error=` + encodeURIComponent('error_rodizioCreate'));
          });

          if (rodizio) {
            rodizio.forEach(async (value) => {
              await grupo.addGrupo_Rodizio(value.id);
            });

            grupoMembros.forEach(async (membros) => {
              rodizio.forEach(async (rod) => {
                await membros.addRodizio_Aluno(rod.id);
              });
            });

            let result = JSON.stringify(true);
            //return res.send(result);
            return res.redirect(`/user/rodizio/create/grupo?success=` + encodeURIComponent('success_rodizioCreate'));

          } else {
            await rodizio.destroy();
            let error = new Error('Um erro aconteceu durante a criação do rodízio');
            console.log(error);
            return res.redirect(`/user/rodizio/create/grupo?error=` + encodeURIComponent('error_rodizioCreate'));

          }
        }

      } else {
        return res.redirect(`/user/rodizio/create/grupo?error=` + encodeURIComponent('grupo_vazio'));

      }
    }
  } else {
    return res.redirect('/404');
  }
}

async function storeRodizioIndividual(req, res) {
  const token_atual = req.cookies["x-access-token"];
  const user_id = Cookie_Verifier.userIdToken(token_atual);
  const user = await Index.User.findByPk(user_id);

  if (!user) return fnRedirectPages.userNull(res);

  const tipo_user = Cookie_Verifier.tipoUserToken(token_atual);

  if (tipo_user === 'supervisor') {
    const {
      alunoSelected,
      turmaSelected,
      discSelected,
      hospitalSelected,
      rodizio_numero,
      data_inicio,
      data_fim,
    } = req.body;

    let disciplinaFormatada = formatterDisciplina(discSelected);

    if (!disciplinaFormatada) {
      let error = new Error('Esta disciplina não existe na função formatterDisciplina!');
      console.log(error);
      return res.redirect(`/user/rodizio/create/ind?error=` + encodeURIComponent('no_discHosp'));
    }

    if (alunoSelected) {
      const aluno = await Index.Aluno.findOne({
        where: {
          id: alunoSelected
        },
        include: {
          association: 'Rodizio_Aluno',
          required: false
        }
      }).catch((error) => { return fnRedirectPages.render500(res, error); });

      const rodizio = await Index.Rodizio.create({
        turma: turmaSelected,
        tipo_rodizio: 'individual',
        disciplina: disciplinaFormatada,
        hospital: hospitalSelected,
        rodizio_numero: rodizio_numero,
        data_inicio: data_inicio,
        data_fim: data_fim
      }).catch((error) => { return fnRedirectPages.render500(res, error); });

      if (rodizio) {
        await aluno.addRodizio_Aluno(rodizio.id);
        return res.redirect(`/user/rodizio/create/ind?success=` + encodeURIComponent('success_rodizioCreate'));

      } else {
        return res.redirect(`/user/rodizio/create/ind?error=` + encodeURIComponent('error_rodizioCreate'));
      }
    } else {
      return res.redirect(`/user/rodizio/create/ind?error=` + encodeURIComponent('no_aluno'));
    }

  } else {
    return res.redirect('/404');
  }
}

async function displayRodizioWindowGrupo(req, res) {
  const token_atual = req.cookies["x-access-token"];
  const tipo_user = Cookie_Verifier.tipoUserToken(token_atual);

  if (tipo_user === 'supervisor') {

    const grupo = await Index.Grupo_Aluno.findAll();
    //const alunoAll = await Index.Aluno.findAll();

    res.render('criar_Rodizio_Grupo', {
      //aluno: alunoAll,
      grupo: grupo,
    });
  } else {
    return res.redirect('/404');
  }
}

async function displayRodizioWindowInd(req, res) {
  const token_atual = req.cookies["x-access-token"];
  const tipo_user = Cookie_Verifier.tipoUserToken(token_atual);

  if (tipo_user === 'supervisor') {
    const alunoAll = await Index.Aluno.findAll();

    res.render('criar_Rodizio_Individual', {
      aluno: alunoAll
    });
  } else {
    return res.redirect('/404');
  }
}

module.exports = {
  storeRodizioGrupo,
  storeRodizioIndividual,
  displayRodizioWindowGrupo,
  displayRodizioWindowInd
}