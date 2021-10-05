$(document).ready(function ($) {
  $("#success_alert").hide();
  $("#error_alert").hide();

  $("#turmaSelected").on('change', function () {
    let turmaSelected = $(this).val();

    $.ajax({
      url: '/info/turma',
      type: 'POST',
      data: { turma: turmaSelected },
      success: function (data) {
        let grupo = jQuery.parseJSON(data);

        $(grupo).each((i, e) => {
          $('#grupoSelected').append(`<option value="${e.id}"> ${e.nome_grupo} </option>`);
        });

        let map = {};
        $("#grupoSelected option").each(function () {
          if (map[this.value]) {
            $(this).remove();
          } else if (!data.includes(this.value)) {
            $(this).remove();
          }
          map[this.value] = true;
        });

        var map_row = {};
        $('#tabelaAluno td').each(function () {
          var txt = $(this).text();

          if (map_row[txt]) {
            $(this).remove();
          } else if (!data.includes(txt)) {
            $(this).remove();
          }

          map_row[txt] = true;
        });

        if (data.includes('md9')) {
          return getAlunoMD9();
        } else if (data.includes('md10')) {
          return getAlunoMD10();
        } else if (data.includes('md11')) {
          return getAlunoMD11();
        } else if (data.includes('md12')) {
          return getAlunoMD12();
        }
      },
      error: function (error) {
        if (error.message === undefined || error == 0) {
          $("#error_alert").show();
          $('#error_alert').text('Nenhum grupo foi encontrado.');
          console.log('Error: ' + error.message);
        }
      }
    });
  });

  $("#bttn_submit").on('click', function (event) {

    $.ajax({
      type: "POST",
      url: "/grupo/add",
      data: $('#addMembroForm').serialize(),
      success: function (data) {
        const flag = jQuery.parseJSON(data);

        if (flag) {
          $('#success_alert').text('Aluno adicionado com sucesso!');

          $("#success_alert").fadeTo(2000, 500).slideUp(1000, function () {
            $("#success_alert").slideUp(1000);
          });

          if ($("#turmaSelected").val() === 'md9') {
            $('#tabelaAluno td').remove();
            return getAlunoMD9();

          } else if ($("#turmaSelected").val() === 'md10') {
            $('#tabelaAluno td').remove();
            return getAlunoMD10();

          } else if ($("#turmaSelected").val() === 'md11') {
            $('#tabelaAluno td').remove();
            return getAlunoMD11();

          } else if ($("#turmaSelected").val() === 'md12') {
            $('#tabelaAluno td').remove();
            return getAlunoMD12();
          }
        } else {
          $('#error_alert').text('O aluno selecionado já possui grupo');

          $("#error_alert").fadeTo(2000, 500).slideUp(1000, function () {
            $("#error_alert").slideUp(1000);
          });
        }
      },
      error: function () {
        $("#error_alert").show();
        $('#error_alert').text('Ocorreu um erro durante a requisição ao banco. Por favor, tente novamente mais tarde.');

        console.log('Error: ' + error.message);
      }
    });

    event.preventDefault();
  });

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  if (params.error === 'no_aluno') {
    $("#error_alert").show();
    $('#error_alert').text('Nenhum aluno foi selecionado.');
  }
});


function getAlunoMD9() {
  $.ajax({
    url: '/info/aluno',
    type: 'GET',
    success: function (data) {
      let aluno = jQuery.parseJSON(data);

      $(aluno).each((i, e) => {
        if ((e.livre) && (e.turma === 'md9')) {
          $("#tabelaAluno").append(`
            <tr>
              <td class=\"text-center\"> <input type=\"checkbox\" name=\"aluno_checkbox\" value=\"${e.id}\"> </td>
              <td class=\"text-center\"> ${e.nome_completo} </td>
              <td class=\"text-center\"> ${e.matricula} </td>
            </tr>`);
        }
      });
    },
    error: function (error) {
      $("#error_alert").show();
      $('#error_alert').text('Ocorreu um erro durante a requisição ao banco. Por favor, tente novamente mais tarde.');

      console.log('Error: ' + error.message);
    }
  });
}

function getAlunoMD10() {
  $.ajax({
    url: '/info/aluno',
    type: 'GET',
    success: function (data) {
      let aluno = jQuery.parseJSON(data);

      $(aluno).each((i, e) => {
        if ((e.livre) && (e.turma === 'md10')) {
          $("#tabelaAluno").append(`
            <tr>
              <td class=\"text-center\"> <input type=\"checkbox\" name=\"aluno_checkbox\" value=\"${e.id}\"> </td>
              <td class=\"text-center\"> ${e.nome_completo} </td>
              <td class=\"text-center\"> ${e.matricula} </td>
            </tr>`);
        }
      });
    },
    error: function (error) {
      $("#error_alert").show();
      $('#error_alert').text('Nenhum aluno foi encontrado.');

      console.log('Error: ' + error.message);
    }
  });
}

function getAlunoMD11() {
  $.ajax({
    url: '/info/aluno',
    type: 'GET',
    success: function (data) {
      let aluno = jQuery.parseJSON(data);

      $(aluno).each((i, e) => {
        if ((e.livre) && (e.turma === 'md11')) {
          $("#tabelaAluno").append(`
            <tr>
              <td class=\"text-center\"> <input type=\"checkbox\" name=\"aluno_checkbox\" value=\"${e.id}\"> </td>
              <td class=\"text-center\"> ${e.nome_completo} </td>
              <td class=\"text-center\"> ${e.matricula} </td>
            </tr>`);
        }
      });
    },
    error: function (error) {
      $("#error_alert").show();
      $('#error_alert').text('Nenhum aluno foi encontrado.');

      console.log('Error: ' + error.message);
    }
  });
}

function getAlunoMD12() {
  $.ajax({
    url: '/info/aluno',
    type: 'GET',
    success: function (data) {
      let aluno = jQuery.parseJSON(data);

      $(aluno).each((i, e) => {
        if ((e.livre) && (e.turma === 'md12')) {
          $("#tabelaAluno").append(`
            <tr>
              <td class=\"text-center\"> <input type=\"checkbox\" name=\"aluno_checkbox\" value=\"${e.id}\"> </td>
              <td class=\"text-center\"> ${e.nome_completo} </td>
              <td class=\"text-center\"> ${e.matricula} </td>
            </tr>`);
        }
      });
    },
    error: function (error) {
      $("#error_alert").show();
      $('#error_alert').text('Nenhum aluno foi encontrado.');

      console.log('Error: ' + error.message);
    }
  });
}