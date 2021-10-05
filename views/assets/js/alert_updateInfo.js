$(document).ready(function ($) {
  $("#error_alert").hide();
  $("#error_alert1").hide();
  $("#error_alert2").hide();
  $("#error_alert3").hide();

  $("#success_alert").hide();

  checkPasswordStrength();

  // EMAIL
  $("#submit_bttn2").click(function (e) {
    let novo_email = $('#email').val();
    let confirm_email = $('#confirm_email').val();

    if (novo_email !== confirm_email) {
      $("#error_alert2").show();
      $('#error_alert2').text('Os emails fornecidos não coincidem');
      e.preventDefault();
    }
  });

  // SENHA
  $("#submit_bttn3").click(function (e) {
    let password = $("#password").val();
    let confirm_password = $("#confirm_password").val();

    if (password.length < 8) {
      $("#error_alert3").show();
      $('#error_alert3').text('A senha deve ter no mínimo 8 caracteres');
      e.preventDefault();

    } else if (password != confirm_password) {
      $("#error_alert3").show();
      $('#error_alert3').text('As senhas digitadas não coincidem');
      e.preventDefault();
    }
  });

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  if (params.success === 'success_alter') {
    $("#success_alert").show();
    $('#success_alert').text('Cadastro atualizado com sucesso!');
  }

  if (params.error === 'error_alter') {
    $("#error_alert").show();
    $('#error_alert').text('Houve um erro durante a alteração de seu cadastro. Por favor, tente novamente mais tarde.');
  }

  if (params.error === 'campo_vazio') {
    $("#error_alert").show();
    $('#error_alert').text('Por favor, preencha algum dos campos abaixo');
  }

  if (params.error === 'email_exist') {
    $("#error_alert2").show();
    $('#error_alert2').text('O email fornecido já existe!');
  }

  if (params.error === 'senhaAtual_incorreta') {
    $("#error_alert3").show();
    $('#error_alert3').text('A senha atual está incorreta!');
  }

  if (params.error === 'mesma_senha') {
    $("#error_alert3").show();
    $('#error_alert3').text('Não é possível atualizar a senha atual com ela mesma!');
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
      strengthBadge.style.backgroundColor = "green"
    } else if (mediumPassword.test(PasswordParameter)) {
      strengthBadge.style.backgroundColor = 'yellow'
    } else {
      strengthBadge.style.backgroundColor = 'red'
    }
  }

  // Adding an input event listener when a user types to the  password input 
  password.addEventListener("input", () => {

    //The badge is hidden by default, so we show it
    strengthBadge.style.display = 'block'
    clearTimeout(timeout);

    //We then call the StrengChecker function as a callback then pass the typed password to it
    timeout = setTimeout(() => StrengthChecker(password.value), 500);

    //Incase a user clears the text, the badge is hidden again
    if (password.value.length !== 0) {
      strengthBadge.style.display != 'block'
    } else {
      strengthBadge.style.display = 'none'
    }
  });
}
