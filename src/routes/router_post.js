// Imports
const express = require('express');
const multer = require('multer');
const sanitize = require('sanitize-filename');
const uuidv4 = require("uuid/v4");
const crypto = require("crypto");

//Models
const Index = require('../models');

// Controllers
const User_Controller = require('../controllers/User_Controller');
const Login_Controller = require('../controllers/Login_Controller');
const Image_Controller = require('../controllers/Image_Controller');
const Grupo_Controller = require('../controllers/Grupo_Controller');
const Rodizio_Controller = require('../controllers/Rodizio_Controller');
const Profile_Controller = require('../controllers/Profile_Controller');
const Hospital_Controller = require('../controllers/Hospital_Controller');
const Info_Controller = require('../controllers/Info_Controller');

// lib
const Cookie_Verifier = require('../lib/Cookie_Verifier');

const router = express.Router();

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


module.exports = router;