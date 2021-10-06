const express = require('express');
const router = express.Router();

const Login_Controller = require('../src/controllers/Login_Controller');

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/login', Login_Controller.login_redireciona);
router.post('/login/aluno', Login_Controller.login);
router.post('/login/supervisor', Login_Controller.login);
router.post('/login/hospital', Login_Controller.login);
router.post('/login/func', Login_Controller.login);


module.exports = router;