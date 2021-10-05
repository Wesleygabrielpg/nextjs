$(document).ready(function ($) {
  $("#error_alert").hide();
  $("#success_alert").hide();

  checkPasswordStrength();

  $("#submit_bttn").click(function (e) {

    let password = $("#password").val();
    let confirm_password = $("#confirm_password").val();

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

  if (params.success === 'email_enviado') {
    $("#success_alert").show();
    $('#success_alert').text('Link para redefinição de senha enviado com sucesso para o email fornecido! Caso não encontre o email, cheque sua caixa de spam.');
  }

  if (params.error === 'no_user') {
    $("#error_alert").show();
    $('#error_alert').text('Nenhum usuário foi encontrado com este email');
  }

  if (params.error === 'error_server') {
    $("#error_alert").show();
    $('#error_alert').text('Houve um erro de comunicação com o servidor. Por favor, cheque a sua internet e tente novamente mais tarde');
  }

});

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
