// Imports
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

// lib
const Cookie_Verifier = require('../lib/Cookie_Verifier');

// Models
const Index = require('../models/Index');

// ######################## REDIRECIONA LOGIN ########################### //
async function login_redireciona(req, res, next) {
  const { email } = req.body;
  let user;
  let tipo;

  if (email) {
    user = await Index.User.findOne({ where: { email: email } })
      .catch((error) => {
        console.log(error);
        return res.redirect('/login?error=' + encodeURIComponent('no_user'));
      });

    if (!user) return res.redirect('/login?error=' + encodeURIComponent('Incorrect_Credential'));
  } else {
    return res.redirect('/login?error=' + encodeURIComponent('no_email'));
  }

  if (user) {
    tipo = user.tipo_user;
  }

  if (tipo == 'aluno') {
    res.redirect(307, '/login/aluno'); // 307 - Código para temporariamente redirecionar os dados do tipo "post"
  } else if (tipo == 'supervisor') {
    res.redirect(307, '/login/supervisor');
  } else if (tipo == 'adminHosp') {
    res.redirect(307, '/login/hospital');
  } else if (tipo == 'funcHosp') {
    res.redirect(307, '/login/func');
  } else {
    return res.redirect('/login?error=' + encodeURIComponent('no_user'));
  }
}

async function logout(req, res) {
  const token_atual = req.cookies["x-access-token"];
  const user_id = Cookie_Verifier.userIdToken(token_atual);

  const user = await Index.User.findByPk(user_id);

  if (!user) return res.redirect('/');

  if (user) {
    user.token_active = null;
    await user.save();

    res.clearCookie('x-access-token');

    return res.redirect('/login');
  }
}

// Salva o cookie no db, dessa forma fica mais fácil checa se o user é o mesmo do cookie
// e impede que ele acesse o login de outro user
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await Index.User.findOne({ where: { email: email } });
    if (!user)
      return res.redirect('/login?error=' + encodeURIComponent('Incorrect_Credential'));

    const validPassword = await user.comparePassword(password, user.password);
    if (!validPassword) return res.redirect('/login?error=' + encodeURIComponent('Incorrect_Credential'));


    if (user && validPassword) {
      // cria o token e 'coloca' a id e o tipo do user dentro
      const accessToken = jwt.sign({ user_id: user.id, tipo_user: user.tipo_user }, process.env.SECRET, { expiresIn: "1h" });

      user.token_active = accessToken; // Salva o token no db

      await user.save();

      // salva o token na res como um cookie 'x-access-token'
      res.cookie('x-access-token', accessToken, {
        sameSite: 'none',
        secure: true,
        httpOnly: true,
        expires: dayjs().add(1, "h").toDate()
      });

      if (user.tipo_user == 'aluno') {
        return res.redirect(`/user/index_Aluno`);

      } else if (user.tipo_user == 'supervisor') {
        return res.redirect(`/user/docs/pendentes`);

      } else if (user.tipo_user == 'adminHosp') {
        return res.redirect(`/user/index_Hospital`);

      } else if (user.tipo_user == 'funcHosp') {
        return res.redirect(`/user/index_Funcionario`);
      }
      else {
        return res.status(401).send({
          message: 'Não autorizado!',
        });
      }
    }
  } catch (error) {
    next(error);
  }
}

module.exports =
{
  login_redireciona,
  login,
  logout
}
