$(document).ready(function ($) {
  $("#error_alert").hide();
  $("#success_alert").hide();

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  if (params.success === 'success_cadastro') {
    $("#success_alert").show();
    $('#success_alert').text('Cadastro realizado com sucesso!');
  }

  if (params.success === 'passUp') {
    $("#success_alert").show();
    $('#success_alert').text('Senha redefinida com sucesso!');
  }

  if (params.error === 'Incorrect_Credential') {
    $("#error_alert").show();
    $('#error_alert').text('Email ou senha incorretos');
  }

  if (params.error === 'no_user') {
    $("#error_alert").show();
    $('#error_alert').text('Nenhum usuário com essas credenciais foi encontrado');
  }

  if (params.error === 'no_email') {
    $("#error_alert").show();
    $('#error_alert').text('Forneça email e senha válidos!');
  }

  if (params.error === 'senhaAtual_incorreta') {
    $("#error_alert").show();
    $('#error_alert').text('A senha atual está incorreta!');
  }

  if (params.error === 'tokenExp') {
    $("#error_alert").show();
    $('#error_alert').text('Sua sessão expirou. Por favor, faça seu login novamente.');
  }

  if (params.error === 'noToken') {
    $("#error_alert").show();
    $('#error_alert').text('Você não possui um token válido.');
  }
});
