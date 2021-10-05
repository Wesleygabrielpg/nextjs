// Imports
const express = require('express');
const dayjs = require('dayjs');
const multer = require('multer');
const sanitize = require('sanitize-filename');
const uuidv4 = require("uuid/v4");
const crypto = require("crypto");

//Models
const Index = require('../models');

// Controllers
const User_Controller = require('../controllers/User_Controller');
const Profile_Controller = require('../controllers/Profile_Controller');
const Login_Controller = require('../controllers/Login_Controller');
const Image_Controller = require('../controllers/Image_Controller');
const Grupo_Controller = require('../controllers/Grupo_Controller');
const Rodizio_Controller = require('../controllers/Rodizio_Controller');
const Hospital_Controller = require('../controllers/Hospital_Controller');
const Info_Controller = require('../controllers/Info_Controller');

// lib
const Cookie_Verifier = require('../lib/Cookie_Verifier');
const fnRedirectPages = require('../lib/fnRedirectPages');

const router = express.Router();


router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/user/upload', Cookie_Verifier.verifyJWT, (req, res) => {
  res.render('Enviar_Docs');
});

router.get('/user/add/hospital', Cookie_Verifier.verifyJWT, (req, res) => {
  res.render('add_Hospital');
});

router.get('/user/grupo/create', Cookie_Verifier.verifyJWT, (req, res) => {
  res.render('Criar_Grupo');
});


// TWILIGHT ZONE
router.get('/404', (req, res) => {
  res.render('404');
});

router.get('/500', (req, res) => {
  try {
    return res.render('500', { error: '' });
  } catch (error) {
    console.log('Error: ', error);
    return res.render('500', { error: 'Um erro aconteceu. É tudo o que sabemos.' });
  }
});
// TWILIGHT ZONE

// ########################################################################### //
// ######################## LOGIN, CADASTRO E LOGOUT ZONE #################### //
router.get('/', Cookie_Verifier.verifyJWT, async (req, res) => {
  const token_atual = req.cookies["x-access-token"];

  if (!token_atual) return res.redirect('/login');

  const user_id = Cookie_Verifier.userIdToken(token_atual);
  const user = await Index.User.findByPk(user_id);

  if (!user) return fnRedirectPages.userNull(res);

  const token_db = user.token_active;
  const tipo_user = user.tipo_user;

  if (!token_db) return res.redirect('/login');

  if (token_atual) {
    if (tipo_user == 'aluno') {
      return res.redirect(`/user/index_Aluno`);

    } else if (tipo_user == 'supervisor') {
      return res.redirect(`/user/docs/pendentes`);

    } else if (tipo_user == 'adminHosp') {
      return res.redirect(`/user/index_Hospital`);

    } else if (tipo_user == 'funcHosp') {
      return res.redirect(`/user/index_Funcionario`);
    }
  } else {
    return res.redirect('/login');
  }
});

router.get('/user/logout', Cookie_Verifier.verifyJWT, Login_Controller.logout);

router.get('/cadastroAl', fnRedirectPages.renderCadastroAluno);

router.get('/cadastroHo', fnRedirectPages.renderCadastroHospital);

router.get('/redefinir-senha', (req, res) => {
  res.render('send_linkResetPass');
});



router.get('/password-reset/:reset_token', async (req, res) => {
  const reset_token = req.params.reset_token;


  res.cookie('reset-token', reset_token, {
    sameSite: 'none',
    secure: true,
    httpOnly: true,
    expires: dayjs().add(1, "h").toDate()
  });


  //res.render('reset_Senha', { reset_token: reset_token });

  res.render('reset_Senha');
});



// ########################################################################### //
// ######################## USER ZONE ##################################### //
router.get('/user/index_Aluno', Cookie_Verifier.verifyJWT, Profile_Controller.profileAluno);

router.get('/user/editProfileAl', Cookie_Verifier.verifyJWT, Profile_Controller.showEditProfileAl);

// ########################################################################### //
// ######################## SUPERVISOR ZONE ################################### //

router.get('/user/index_Supervisor', Cookie_Verifier.verifyJWT, Profile_Controller.profileSuper);

router.get('/user/rodizio/create/grupo', Cookie_Verifier.verifyJWT, Rodizio_Controller.displayRodizioWindowGrupo);

router.get('/user/rodizio/create/ind', Cookie_Verifier.verifyJWT, Rodizio_Controller.displayRodizioWindowInd);


router.get('/info/aluno', Cookie_Verifier.verifyJWT, Info_Controller.displayAluno);
router.get('/info/hospital', Cookie_Verifier.verifyJWT, Info_Controller.displayHospital);


router.get('/user/docs/pendentes', Cookie_Verifier.verifyJWT, Image_Controller.displayDocs);

router.get('/user/aluno/turma', Cookie_Verifier.verifyJWT, Profile_Controller.showEditAlunoTurma);

router.get('/user/grupo/add/', Cookie_Verifier.verifyJWT, Grupo_Controller.addMembroWindow);

router.get('/user/grupo/remove/', Cookie_Verifier.verifyJWT, Grupo_Controller.renderRemoveMembro);

router.get('/user/grupo/delete/', Cookie_Verifier.verifyJWT, Grupo_Controller.delGrupoWindow);


// ########################################################################### //
// ######################## HOSPITAL ZONE #################################### //
router.get('/user/index_Hospital', Cookie_Verifier.verifyJWT, Profile_Controller.profileHospital);

router.get('/user/editProfileHo', Cookie_Verifier.verifyJWT, Profile_Controller.showEditProfileHo);

router.get('/user/index_Funcionario', Cookie_Verifier.verifyJWT, Profile_Controller.profileFuncionario);

router.get('/user/func/', Cookie_Verifier.verifyJWT, Hospital_Controller.windowFuncionarioCad);

router.get('/user/rodizio/', Cookie_Verifier.verifyJWT, Hospital_Controller.displayRodizio);

router.get('/user/aluno/', Cookie_Verifier.verifyJWT, Hospital_Controller.displayAluno);



// Salva os arq dentro do HDD do servidor
const imageUpload = multer.diskStorage({
  // Pasta onde as imgs serão salvas dentro do HD
  destination: function (req, file, cb) {
    cb(null, './src/uploads/');
  },
  // Nome do arq uma vez salvo na pasta -> id aleatória + _ + nome do arq+ext em minúsculo e sem espaço
  filename: function (req, file, cb) {

    cb(
      null,
      uuidv4().toString() +
      "_" +
      sanitize(file.originalname.toLowerCase().replace(/\s/g, ""))
    );
  }
});

let helper = Image_Controller.imageFilter;
var upload = multer({ storage: imageUpload, fileFilter: helper });

// ########################################################################### //
// ######################## LOGIN ZONE ######################################## //
router.post('/login', Login_Controller.login_redireciona);

router.post('/login/aluno', Login_Controller.login);

router.post('/login/supervisor', Login_Controller.login);

router.post('/login/hospital', Login_Controller.login);

router.post('/login/func', Login_Controller.login);

// ########################################################################### //
// ######################## USER ZONE ######################################## //
router.post('/cadastro/aluno', User_Controller.storeAluno);

router.post('/cadastro/super', User_Controller.storeSupervisor);

router.post('/cadastro/hosp', User_Controller.storeHospital);

router.post('/editProfileAl/sub', Cookie_Verifier.verifyJWT, Profile_Controller.updateAluno);

router.post('/aluno/upload/image', Cookie_Verifier.verifyJWT, upload.single('file1'), Image_Controller.createImage);

router.post('/aluno/delete/image', Cookie_Verifier.verifyJWT, Image_Controller.deleteFunction);


router.post("/reset/send-link", User_Controller.sendLinkResetPass);

router.post("/reset/passw", User_Controller.checkResetPasswordToken, User_Controller.resetPassword);


// ########################################################################### //
// ######################## SUPERVISOR ZONE ################################### //
router.post('/docs/val', Cookie_Verifier.verifyJWT, Image_Controller.updateDocStatus);

router.post('/add/hosp', Cookie_Verifier.verifyJWT, User_Controller.addHospital);

router.post('/grupo/create', Cookie_Verifier.verifyJWT, Grupo_Controller.storeGrupo);

router.post('/grupo/add', Cookie_Verifier.verifyJWT, Grupo_Controller.storeMembro);

router.post('/grupo/remove', Cookie_Verifier.verifyJWT, Grupo_Controller.removeMembro);

router.post('/aluno/turma/up', Cookie_Verifier.verifyJWT, Profile_Controller.updateAlunoTurma);

// ######################## RODÍZIO ZONE ####################################### //
router.post('/rodizio/create/gru', Cookie_Verifier.verifyJWT, Rodizio_Controller.storeRodizioGrupo);

router.post('/rodizio/create/ind', Cookie_Verifier.verifyJWT, Rodizio_Controller.storeRodizioIndividual);


router.post('/info/turma', Cookie_Verifier.verifyJWT, Info_Controller.displayTurma);


// ########################################################################### //
// ######################## HOSPITAL ZONE ####################################### //
router.post('/func/add', Cookie_Verifier.verifyJWT, Hospital_Controller.storeFuncionario);

router.post('/editProfileHo/sub', Cookie_Verifier.verifyJWT, Profile_Controller.updateHospital);