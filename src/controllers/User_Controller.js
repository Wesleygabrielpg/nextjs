// Imports
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');

// Models
const Index = require('../models/Index');

// lib
const Cookie_Verifier = require('../lib/Cookie_Verifier');
const fnRedirectPages = require('../lib/fnRedirectPages');

async function storeAluno(req, res) {
  // Corpo da requisição aka o que vai ser recebido do frontend
  const { email, password, nome_completo, turma, matricula, cpf } = req.body;

  const emailExists = await Index.User.findOne({
    where: { email: email }
  }).catch((error) => { return fnRedirectPages.render500(res, error); });

  const matricula_check = await Index.Aluno.findOne({
    where: { matricula: matricula }
  }).catch((error) => { return fnRedirectPages.render500(res, error); });

  const cpf_check = await Index.Aluno.findOne({
    where: { cpf: cpf }
  }).catch((error) => { return fnRedirectPages.render500(res, error); });

  try {
    if (!emailExists && (!matricula_check && !cpf_check)) {
      const user = await Index.User.create({
        email,
        password,
      }).catch(async (error) => {
        console.log(error);
        return res.redirect('/500');
      });

      if (user) {
        const aluno = await Index.Aluno.create({
          user_id: user.id,
          nome_completo,
          turma,
          livre: true,
          matricula,
          cpf
        }).catch(async (error) => {
          await user.destroy();
          console.log(error);
          return res.redirect('/500');
        });

        if (user && aluno) {
          return res.redirect('/login?success=' + encodeURIComponent('success_cadastro'));
        }
      }
    } else {
      if (matricula_check) {
        return res.redirect('/cadastroAl?error=' + encodeURIComponent('matricula_exist'));

      } else if (cpf_check) {
        return res.redirect('/cadastroAl?error=' + encodeURIComponent('cpf_exist'));

      } else if (emailExists) {
        return res.redirect('/cadastroAl?error=' + encodeURIComponent('email_exist'));

      } else if (conta_aluno !== 'aluno') {
        console.log(error);
        return res.redirect('/500');
      }
    }

  } catch (error) {
    console.log(error);
    return res.redirect('/500');
  }
}

// So utilizar quando for necessário criar outro perfil do mesmo tipo. Caso contrário, não mexer
async function storeSupervisor(req, res) {
  const { email, password } = req.body;

  const emailExists = await Index.User.findOne({
    where: { email: email }
  }).catch((error) => { fnRedirectPages.render500(res, error); });

  const tipo_conta = 'supervisor';

  if (!emailExists && tipo_conta == 'supervisor') {
    const user = await Index.User.create({
      email: email,
      password: password,
      tipo_user: tipo_conta
    }).catch(async (error) => {
      await user.destroy();
      return fnRedirectPages.render500(res, error);

    }).then((user) => {
      if (user) {
        return res.redirect('/login');
      } else {
        return res.status(500).send({
          message: "Ocorreu um erro durante o cadastro do usuário"
        });
      }

    }).catch((error) => { fnRedirectPages.render500(res, error); });

  } else {
    if (emailExists) {
      return res.status(409).send({
        message: "Esse email já existe!"
      });
    } else if (conta_aluno != 'supervisora') {
      return res.status(409).send({
        message: "Tipo de conta invalida!"
      });
    }
  }
}

async function storeHospital(req, res) {
  // Corpo da requisição aka o que vai ser recebido do frontend
  const {
    email,
    password,
    hospSelect,
    endereco,
    bairro,
    numero,
    telefone
  } = req.body;

  const emailExists = await Index.User.findOne({
    where: { email: email }
  }).catch((error) => { return fnRedirectPages.render500(res, error); });

  const nome_hospital_check = await Index.Hospital.findOne({
    where: { nome_hospital: hospSelect }
  }).catch((error) => { return fnRedirectPages.render500(res, error); });

  const foneSemHifen = telefone.replace(/\-/g, '');

  const tipo_conta = 'adminHosp'; // Necessário para diferenciar os diferentes perfis

  try {
    if ((!emailExists && tipo_conta == 'adminHosp') && !nome_hospital_check) {
      const user = await Index.User.create({
        email: email,
        password: password,
        tipo_user: tipo_conta
      }).catch(async (error) => {
        return fnRedirectPages.render500(res, error);
      });

      if (user) {
        const hospital = await Index.Hospital.create({
          user_id: user.id,
          nome_hospital: hospSelect,
          endereco: endereco,
          bairro: bairro,
          numero: numero,
          telefone: foneSemHifen
        }).catch(async (error) => {
          await user.destroy();
          return fnRedirectPages.render500(res, error);
        });

        if (user && hospital) {
          return res.redirect('/login?success=success_cadastro');
        }
      }
    } else {
      if (emailExists) {
        return res.redirect('/cadastroHo?error=' + encodeURIComponent('email_exist'));

      } else if (nome_hospital_check) {
        return res.redirect('/cadastroHo?error=' + encodeURIComponent('hosp_exist'));

      } else if (foneSemHifen.length > 11 || foneSemHifen.length < 8) {
        return res.redirect('/cadastroHo?error=' + encodeURIComponent('telefone_incorreto'));

      } else if (conta_hospital != 'adminHosp') {
        return res.redirect('/cadastroHo?error=' + encodeURIComponent('contaTipo_errada'));
      }
    }

  } catch (error) {
    return fnRedirectPages.render500(res, error);
  }
}

async function addHospital(req, res) {
  const token_atual = req.cookies["x-access-token"];
  const user_id = Cookie_Verifier.userIdToken(token_atual);
  const user = await Index.User.findByPk(user_id);

  if (!user) return fnRedirectPages.userNull(res);

  const tipo_user = Cookie_Verifier.tipoUserToken(token_atual);

  if (tipo_user === 'supervisor') {
    const { hospNome } = req.body;

    const hosp = await Index.Nome_Hosp.findOne({
      where: {
        nome_hospital: hospNome
      }
    });

    if (hosp) {
      return res.redirect(`/user/add/hospital?error=` + encodeURIComponent('hosp_exist'));
    } else {
      const hospital = await Index.Nome_Hosp.create({
        nome_hospital: hospNome,
      }).catch(async (error) => {
        await user.destroy();
        return res.redirect(`/user/add/hospital?error=` + encodeURIComponent('err_addHosp'));
      });

      if (hospital) {
        return res.redirect(`/user/add/hospital?success=` + encodeURIComponent('success_addHosp'));

      }
    }
  }

}

async function sendLinkResetPass(req, res) {
  try {
    const { email } = req.body;

    const user_found = await Index.User.findOne({ where: { email: email } }).catch((error) => {
      console.log(error);
      return res.redirect('/redefinir-senha?error=' + encodeURIComponent('error_server'));
    });

    if (!user_found) return res.redirect('/redefinir-senha?error=' + encodeURIComponent('no_user'));

    const user_token_reset = await user_found.reset_password_token;

    if (user_found) {
      //let token_reset;
      //token_reset = crypto.randomBytes(32).toString("hex");

      const resetToken = jwt.sign({ user_id: user_found.id }, process.env.SECRET, { expiresIn: "1h" });

      user_found.reset_password_token = resetToken;

      await user_found.save();

      const link = `${process.env.BASE_URL}/password-reset/${user_found.reset_password_token}`;
      await sendEmail(user_found.email, "Password reset", link);

      return res.redirect('/redefinir-senha?success=' + encodeURIComponent('email_enviado'));

    } else {
      return res.redirect('/redefinir-senha?error=' + encodeURIComponent('no_user'));
    }

  } catch (error) {
    res.send("An error occured");
    console.log(error);
    return res.redirect('/redefinir-senha?error=' + encodeURIComponent('error_server'));

  }
}

async function sendEmail(email, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: "Clique no link para redefinir sua senha: \n" + text,
    });

    console.log("Email de redefinição de senha enviado com sucesso!");
  } catch (error) {
    console.log(error, "Falha ao enviar o email");
  }
}

function checkResetPasswordToken(req, res, next) {
  const token = req.cookies['reset-token'];
  try {
    const { exp } = jwt.verify(token, process.env.SECRET);

    // Check if token has expired
    if (exp < Date.now().valueOf() / 1000) {
      return res.redirect('/login?error=' + encodeURIComponent('tokenExp'));
    } else {
      next();
    }

  } catch (error) {
    console.log(error);
    return res.redirect('/login?error=' + encodeURIComponent('noToken'));
  }
}

async function resetPassword(req, res, next) {
  const token = req.cookies['reset-token'];

  if (!token) return res.redirect(`/login/?error=` + encodeURIComponent('noToken'));

  const decoded = jwt_decode(token);
  const user_id = decoded.user_id;

  const user = await Index.User.findByPk(user_id).catch((error) => {
    console.log(error);
    return res.redirect(`/reset-password/${token}/?error=` + encodeURIComponent('no_user'));
  });

  if (user) {
    const { password, confirm_password } = req.body;

    if (password === confirm_password) {
      const userUp = await user.update(
        {
          password: password
        }, {
        where: {
          id: user_id
        }
      });

      if (userUp) {
        user.reset_password_token = null;
        await user.save();

        res.clearCookie('reset-token');

        res.redirect('/login?success=' + encodeURIComponent('passUp'));
      } else {
        return res.redirect(`/login/?error=` + encodeURIComponent('falha_userUp'));
      }
    }
  }

}

module.exports = {
  storeAluno,
  storeSupervisor,
  storeHospital,
  addHospital,
  sendEmail,
  sendLinkResetPass,
  checkResetPasswordToken,
  resetPassword
};
