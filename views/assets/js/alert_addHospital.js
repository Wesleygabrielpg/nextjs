$(document).ready(function ($) {
  $("#success_alert").hide();
  $("#error_alert").hide();

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  if (params.success === 'success_addHosp') {
    $("#success_alert").show();
    $('#success_alert').text('Hospital adicionado com sucesso!');
  }

  if (params.error === 'Incorrect_Credential') {
    $("#error_alert").show();
    $('#error_alert').text('Email ou senha incorreto');
  }

});
