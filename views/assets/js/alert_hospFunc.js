$(document).ready(function ($) {
  $("#error_alert").hide();
  $("#success_alert").hide();

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  if (params.success === 'success_cadFunc') {
    $("#success_alert").show();
    $('#success_alert').text('Cadastro realizado com sucesso!');
  }

  if (params.error === 'Incorrect_Credential') {
    $("#error_alert").show();
    $('#error_alert').text('Email ou senha incorreto');
  }

  if (params.error === 'senha_incorreta') {
    $("#error_alert").show();
    $('#error_alert').text('A senha atual está incorreta!');
  }
});
