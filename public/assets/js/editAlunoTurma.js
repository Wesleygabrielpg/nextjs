$(document).ready(function ($) {
  $("#alunoSelect").change(function () {
    let val = $(this).val();
    $.ajax({
      url: '/aluno/info',
      type: 'POST',
      data: { id: val },
      success: function (data) {
        let turma = jQuery.parseJSON(data);
        let turmaUpper = turma.toUpperCase();

        $("#turmaAl").html(`<option value='${turma}'>${turmaUpper}</option>`);

      },
      error: function (error) {
        if (error.message === undefined) {
          alert('Este aluno não foi encontrado');
        }
        console.log('Error: ' + error.message);
      }
    });
  });
});