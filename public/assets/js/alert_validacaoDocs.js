$(document).ready(function ($) {
  $('#error_alert').hide();
  $('#success_alert').hide();
  let checkedBox = false;

  $('#formMD9').on('submit', (e) => {
    $("input[type=checkbox]").each(function () {
      if ($(this).is(':checked')) {
        checkedBox = true;
      }
    });

    if (!checkedBox) {
      alert("Por favor, selecione pelo menos um PDF");
      e.preventDefault();
    }
  });

  $('#formMD10').on('submit', (e) => {
    $("input[type=checkbox]").each(function () {
      if ($(this).is(':checked')) {
        checkedBox = true;
      }
    });

    if (!checkedBox) {
      alert("Por favor, selecione pelo menos um PDF");
      e.preventDefault();
    }
  });

  $('#formMD11').on('submit', (e) => {
    $("input[type=checkbox]").each(function () {
      if ($(this).is(':checked')) {
        checkedBox = true;
      }
    });

    if (!checkedBox) {
      alert("Por favor, selecione pelo menos um PDF");
      e.preventDefault();
    }
  });
  
  $('#formMD12').on('submit', (e) => {
    $("input[type=checkbox]").each(function () {
      if ($(this).is(':checked')) {
        checkedBox = true;
      }
    });

    if (!checkedBox) {
      alert("Por favor, selecione pelo menos um PDF");
      e.preventDefault();
    }
  });

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  if (params.success === 'success_updt') {
    $("#success_alert").show();
    $('#success_alert').text('Os documentos foram atualizados com sucesso');
  }

  if (params.error === 'no_file') {
    $("#error_alert").show();
    $('#error_alert').text('Nenhum arquivo válido foi selecionado');
  }

});