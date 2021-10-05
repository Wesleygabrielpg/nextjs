$(document).ready(function ($) {

  let foneInput = $("#telefone");

  foneInput.on('blur', (e) => {
    let foneVal = foneInput.val();
    if (foneVal.length !== 0) {
      let t = mascaraDeTelefone(foneVal);
      $('#telefone').val(t);
    }
  });

  foneInput.on('focus', (e) => {
    let foneVal = foneInput.val();
    if (foneVal.length !== 0) {
      let t = tiraHifen(foneVal);
      $('#telefone').val(t);
    }
  });
});

function mascaraDeTelefone(telefone) {
  const textoAtual = telefone;
  const isCelular = textoAtual.length === 10;
  let textoAjustado;

  if (isCelular) {
    const parte1 = textoAtual.slice(0, 6);
    const parte2 = textoAtual.slice(6, 10);
  
    textoAjustado = `${parte1}-${parte2}`;
  } else {
    const parte1 = textoAtual.slice(0, 4);
    const parte2 = textoAtual.slice(4, 8);
  
    textoAjustado = `${parte1}-${parte2}`;
  }

  telefone = textoAjustado;
  return telefone;
}

function tiraHifen(telefone) {
  const textoAtual = telefone;
  const textoAjustado = textoAtual.replace(/\-/g, '');

  telefone = textoAjustado;
  return telefone;
}