$(document).ready(function ($) {
  $("#error_alert").hide();
  $("#success_alert").hide();

  checkPasswordStrength();

  $("#submit_bttn").click(function (e) {

    let cpf = $('#cpf').val();
    let password = $("#password").val();
    let confirm_password = $("#confirm_password").val();

    if (cpf !== undefined && !checkCPF(cpf)) {
      $("#error_alert").show();
      document.getElementById('error_alert').innerText = "Digite um CPF válido";
      e.preventDefault();
    }

    if (password === '') {
      $("#error_alert").show();
      $('#error_alert').text('Digite uma senha válida');
      e.preventDefault();

    } else if (password.length < 8) {
      $("#error_alert").show();
      $('#error_alert').text('A senha deve ter no mínimo 8 caracteres');
      e.preventDefault();

    } else if (password !== confirm_password) {
      $("#error_alert").show();
      $('#error_alert').text('As senhas digitadas não coincidem');
      e.preventDefault();
    }
  });

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  if (params.success === 'success_cadFunc') {
    $("#success_alert").show();
    $('#success_alert').text('Preceptor cadastrado com sucesso!');
  }

  if (params.error === 'error_cadFunc') {
    $("#error_alert").show();
    $('#error_alert').text('Ocorreu um erro durante o cadastro do preceptor. Por favor, tente novamente mais tarde');
  }

  if (params.error === 'hosp_exist') {
    $("#error_alert").show();
    $('#error_alert').text('O hospital escolhido já está cadastrado!');
  }

  if (params.error === 'matricula_exist') {
    $("#error_alert").show();
    $('#error_alert').text('A matricula fornecida já existe');
  }

  if (params.error === 'cpf_exist') {
    $("#error_alert").show();
    $('#error_alert').text('O CPF fornecido já existe');
  }

  if (params.error === 'email_exist') {
    $("#error_alert").show();
    $('#error_alert').text('O email fornecido já existe');
  }

  if (params.error === 'senha_incorreta') {
    $("#error_alert").show();
    $('#error_alert').text('A senha atual está incorreta!');
  }

});

function checkCPF(strCPF) {
  let cpf = strCPF.replace(/[.]|[-]|[ ]/g, '');

  let Soma;
  let Resto;
  Soma = 0;

  if (cpf === "00000000000") return false;

  for (i = 1; i <= 9; i++) Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(cpf.substring(9, 10))) return false;

  Soma = 0;
  for (i = 1; i <= 10; i++) Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(cpf.substring(10, 11))) return false;

  return true;
}

function checkPasswordStrength() {
  // timeout before a callback is called
  let timeout;

  // traversing the DOM and getting the input and span using their IDs
  let password = document.getElementById('password');
  let strengthBadge = document.getElementById('StrengthDisp');

  // The strong and weak password Regex pattern checker
  let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
  let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')

  function StrengthChecker(PasswordParameter) {
    // We then change the badge's color and text based on the password strength

    if (strongPassword.test(PasswordParameter)) {
      strengthBadge.style.backgroundColor = "green";
    } else if (mediumPassword.test(PasswordParameter)) {
      strengthBadge.style.backgroundColor = 'yellow';
    } else {
      strengthBadge.style.backgroundColor = 'red';
    }
  }

  // Adding an input event listener when a user types to the  password input 
  password.addEventListener("input", () => {

    //The badge is hidden by default, so we show it
    strengthBadge.style.display = 'block';
    clearTimeout(timeout);

    //We then call the StrengChecker function as a callback then pass the typed password to it
    timeout = setTimeout(() => StrengthChecker(password.value), 500);

    //Incase a user clears the text, the badge is hidden again
    if (password.value.length !== 0) {
      strengthBadge.style.display != 'block';
    } else {
      strengthBadge.style.display = 'none';
    }
  });
}