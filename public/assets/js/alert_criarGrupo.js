$(document).ready(function ($) {
  $("#success_alert").hide();
  $("#error_alert").hide();

  $("#nome_grupo").select2({
    placeholder: "Selecione ou digite o nome do grupo",
    tags: true
  });

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  if (params.success === 'success_addGrupo') {
    $("#success_alert").show();
    $('#success_alert').text('Grupo criado com sucesso!');
  }

  if (params.error === 'no_grupo') {
    $("#error_alert").show();
    $('#error_alert').text('Houve um erro durante a criação do grupo. Por favor, tente novamente mais tarde.');
  }

});
