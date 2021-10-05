$(document).ready(function ($) {
  $("#error_alert").hide();
  $("#success_alert").hide();

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  if (params.success === 'success_up') {
    $("#success_alert").show();
    $('#success_alert').text('Documento enviado com sucesso!');
  }

  if (params.success === 'success_del') {
    $("#success_alert").show();
    $('#success_alert').text('Documento excluído com sucesso!');
  }

  if (params.error === 'fail_up') {
    $("#error_alert").show();
    $('#error_alert').text('Houve um erro durante o upload do documento. Por favor, tente novamente mais tarde.');
  }

  if (params.error === 'fail_del') {
    $("#error_alert").show();
    $('#error_alert').text('Houve um erro durante a exclusão do documento. Por favor, tente novamente mais tarde.');
  }

  if (params.error === 'no_file') {
    $("#error_alert").show();
    $('#error_alert').text('Forneça um arquivo válido!');
  }

  if (params.error === 'no_file_found') {
    $("#error_alert").show();
    $('#error_alert').text('O arquivo selecionado não foi encontrado! Por favor, entre em reporte este erro.');
  }

});
