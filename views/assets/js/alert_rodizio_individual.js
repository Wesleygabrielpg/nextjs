$(document).ready(function ($) {
  $("#error_alert").hide();
  $("#success_alert").hide();

  $.ajax({
    url: '/info/aluno',
    type: 'GET',
    success: function (data) {
      let aluno = jQuery.parseJSON(data);

      $(aluno).each((i, e) => {
        $('#alunoSelected').append(`<option value="${e.id}" data-tokens="${e.matricula}"> ${e.nome_completo} </option>`);
        $('#alunoSelected').selectpicker('refresh');
      });

    },
    error: function (error) {
      $("#error_alert").show();
      $('#error_alert').text('Nenhum aluno foi encontrado.');

      if (error.message === undefined) {
      }
      console.log('Error: ' + error.message);
    }
  });


  $('#turmaSelected').on('change', () => {
    let turmaSelected = $('#turmaSelected').val();

    if (turmaSelected === 'md9') {
      return displayMD9();

    } else if (turmaSelected.includes('md10')) {
      return displayMD10();

    } else if (turmaSelected.includes('md11')) {
      return displayMD11();

    } else if (turmaSelected.includes('md12')) {
      return displayMD12();
    }
  });

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
    $('#error_alert').text('Nenhum aluno foi encontrado.');
  }


  if (params.error === 'no_discHosp') {
    $("#error_alert").show();
    $('#error_alert').text('Houve um erro durante a criação do rodízio. Por favor, tente novamente mais tarde.');
  }

  /*
  $("#addInput_bttn").on('click', function () {

    let lastField = $("#buildyourform div:last");
    let intId = (lastField && lastField.length && lastField.data("idx") + 1) || 1;
    let fieldWrapper = $("<div class=\"card-box\" id=\"field" + intId + "\"/>");
    fieldWrapper.data("idx", intId);

    let fName = $("<input type=\"text\" class=\"fieldname\" />");
    let fType = $("<select class=\"fieldtype\"><option value=\"checkbox\">Checked</option><option value=\"textbox\">Text</option><option value=\"textarea\">Paragraph</option></select>");

    let inputDisc = $(`
    <select name=\"discSelected__ind\" id=\"discSelected_ind\" class=\"select form-control floating\"> 
      <option value=\'teste\'> Teste </option>
    </select>`);

    let removeButton = $("<input type=\"button\" class=\"remove\" value=\"-\" />");
    removeButton.click(function () {
      $(this).parent().remove();
    });

    //fieldWrapper.append(fName);
    //fieldWrapper.append(fType);
    fieldWrapper.append(inputDisc);
    fieldWrapper.append(removeButton);

    $("#buildyourform").append(fieldWrapper);
  });

  $("#addInput_bttn").on('click', () => {
    let lastField = $('#newInputForm div:last');
    let intId = (lastField && lastField.length && lastField.data("idx") + 1) || 1;
    let fieldWrapper = $("<div class=\"content-wrapper\" id=\"field" + intId + "\"/>");


  })

  $("#preview").click(function () {
    $("#yourform").remove();
    let fieldSet = $("<fieldset id=\"yourform\"><legend>Your Form</legend></fieldset>");
    $("#buildyourform div").each(function () {
      let id = "input" + $(this).attr("id").replace("field", "");
      let label = $("<label for=\"" + id + "\">" + $(this).find("input.fieldname").first().val() + "</label>");
      let input;
      switch ($(this).find("select.fieldtype").first().val()) {
        case "checkbox":
          input = $("<input type=\"checkbox\" id=\"" + id + "\" name=\"" + id + "\" />");
          break;
        case "textbox":
          input = $("<input type=\"text\" id=\"" + id + "\" name=\"" + id + "\" />");
          break;
        case "textarea":
          input = $("<textarea id=\"" + id + "\" name=\"" + id + "\" ></textarea>");
          break;
      }
      fieldSet.append(label);
      fieldSet.append(input);
    });
    $("body").append(fieldSet);
  }); */
});

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
      $("select option").each(function () {
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
      }
      console.log('Error: ' + error.message);
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
