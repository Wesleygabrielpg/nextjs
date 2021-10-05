$(document).ready(function ($) {
  $("#error_alert").hide();
  $("#success_alert").hide();

  getGrupo();

  $("#addInput_bttn").on('click', function () {

    let lastField = $("#rodizio_Form div:last");
    let intId = (lastField && lastField.length && lastField.data("idx") + 1) || 1;
    let fieldWrapper = $("<div class=\"card-box\" id=\"field" + intId + "\"/>");
    fieldWrapper.data("idx", intId);

    let removeButton = $('#removeInput_bttn');
    removeButton.on('click', function () { $('#field' + intId).remove(); });

    let fName = $("<input type=\"text\" class=\"fieldname\" />");
    let fType = $("<select class=\"fieldtype\"><option value=\"checkbox\">Checked</option><option value=\"textbox\">Text</option><option value=\"textarea\">Paragraph</option></select>");

    let selectDisc = $(`<select name=\"discSelected\" id=\"discSelected\" class=\"select form-control floating\">
    </select>`);

    let selectHosp = $(`<select name="hospSelected" id="hospSelected" class="select form-control floating">
    </select>`);




    fieldWrapper.append(selectDisc);
    //fieldWrapper.append(removeButton);

    $("#rodizio_Form").append(fieldWrapper);
  });

  getURLStatus();
});

function getGrupo() {
  $("#turmaSelected").on('change', function () {
    let turmaSelected = $(this).val();

    $.ajax({
      url: '/info/turma',
      type: 'POST',
      data: { turma: turmaSelected },
      success: function (data) {
        let grupo = jQuery.parseJSON(data);

        $(grupo).each((i, e) => {
          $('#grupoSelected').append(`<option value="${e.nome_grupo}"> ${e.nome_grupo} </option>`);
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

        if (data.includes('md9')) {
          return displayMD9();
        } else if (data.includes('md10')) {
          return displayMD10();
        } else if (data.includes('md11')) {
          return displayMD11();
        } else if (data.includes('md12')) {
          return displayMD12();
        }

      },
      error: function (error) {
        if (error.message === undefined || error == []) {
          $("#error_alert").show();
          $('#error_alert').text('Nenhum grupo foi encontrado.');
          console.log('Error: ' + error.message);
        }
      }
    });
  });
}

function getURLStatus() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  if (params.success === 'success_rodizioCreate') {
    $("#success_alert").show();
    $('#success_alert').text('Rodízio foi criado com sucesso');
  }

  if (params.error === 'error_rodizioCreate') {
    $("#error_alert").show();
    $('#error_alert').text('Houve um erro durante a criação do rodízio. Por favor, tente novamente mais tarde.');
  }

  if (params.error === 'no_aluno') {
    $("#error_alert").show();
    $('#error_alert').text('O selecionado aluno mão foi encontrado.');
  }

  if (params.error === 'no_discHosp') {
    $("#error_alert").show();
    $('#error_alert').text('Houve um erro durante a criação do rodízio. Por favor, tente novamente mais tarde.');
  }
}

function getHospital() {
  $.ajax({
    url: '/info/hospital',
    type: 'GET',
    success: function (result) {
      let hospital = jQuery.parseJSON(result);

      $(hospital).each((i, e) => {
        $("#hospitalSelected").append(`<option value='${hospital[i].nome_hospital}'>${hospital[i].nome_hospital}</option>`);
      });

      let map = {};
      $("#hospitalSelected option").each(function () {
        if (map[this.value]) {
          $(this).remove();
        }
        map[this.value] = true;
      });
    },
    error: function (error) {
      if (error.message === undefined || error === "") {
        $("#error_alert").show();
        $('#error_alert').text('Nenhum hospital foi encontrado.');
        console.log('Error: ' + error.message);

      }
    }
  });
}

function displayMD9() {
  $("#discSelected").html(`
    <option value='clinicaMedica'> Clínica Médica </option>
    <option value='clinicaCirurgica'> Clínica Cirúrgica </option>
  `);

  getHospital();
}

function displayMD10() {
  $("#discSelected").html(`
    <option value="pediatria"> Pediatria </option>
    <option value="ginecologiaObstetricia"> Ginecologia e Obstetrícia </option>
  `);

  getHospital();
}

function displayMD11() {
  $("#discSelected").html(`
    <option value="urgenciaEmergencia"> Urgência e Emergência </option>
    <option value="saudeMentalIdoso"> Saúde Mental e do Idoso </option>
    <option value="clinicaEspecializada"> Clínicas Especializadas </option>
  `);

  getHospital();
}

function displayMD12() {
  $("#discSelected").html(`
    <option value="saudeColetiva"> Saúde Coletiva </option>
    <option value="saudeRural"> Saúde Rural </option>
  `);

  getHospital();
}
