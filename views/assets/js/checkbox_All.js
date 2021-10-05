$(document).ready(function ($) {

  document.getElementById('select-all1').onclick = function () {
    let values = $('input[name=select-all1]:checked')
      .map(() => { return this.value; }).get();

    document.getElementById('select-all1').onclick = function () {
      let checkboxes = document.querySelectorAll('input[type="checkbox"]');
      for (let checkbox of checkboxes) {
        checkbox.checked = this.checked;
      }
      return checkboxes;
    };

    return values;
  };
  /*
  document.getElementById('select-all2').onclick = function () {
    let val2 = checkAllMD10();
    return val2;
  };
  document.getElementById('select-all3').onclick = function () {
    let val3 = checkAllMD11();
    return val3;
  };
  document.getElementById('select-all4').onclick = function () {
    let val4 = checkAllMD12();
    return val4;
  };
*/
});

function checkAllMD9() {
  let values = $('input[name=select-all1]:checked')
    .map(() => { return this.value; }).get();

  document.getElementById('select-all1').onclick = function () {
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (let checkbox of checkboxes) {
      checkbox.checked = this.checked;
    }
    return checkboxes;
  };

  return values;
}

function checkAllMD10() {
  let values = $('input[name=select-all2]:checked')
    .map(() => { return this.value; }).get();

  document.getElementById('select-all2').onclick = function () {
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (let checkbox of checkboxes) {
      checkbox.checked = this.checked;
    }
    return checkboxes;
  };

  return values;
}

function checkAllMD11() {
  let values = $('input[name=select-all3]:checked')
    .map(() => { return this.value; }).get();

  document.getElementById('select-all3').onclick = function () {
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (let checkbox of checkboxes) {
      checkbox.checked = this.checked;
    }
    return checkboxes;
  };

  return values;
}

function checkAllMD12() {
  let values = $('input[name=select-all4]:checked')
    .map(() => { return this.value; }).get();

  document.getElementById('select-all4').onclick = function () {
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (let checkbox of checkboxes) {
      checkbox.checked = this.checked;
    }
    return checkboxes;
  };

  return values;
}