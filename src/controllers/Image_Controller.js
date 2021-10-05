// Imports
const path = require('path');
const fs = require('fs');
const sanitize = require('sanitize-filename');

// lib
const Cookie_Verifier = require('../lib/Cookie_Verifier');
const fnRedirectPages = require('../lib/fnRedirectPages');

// Models
const Index = require('../models/Index');

//Funções
const imageFilter = function (req, file, cb) {
  const fileTypes = /pdf|PDF/;

  const extension_name = fileTypes.test(path.extname(file.originalname).toLowerCase());

  // Check mime
  const mimeType = fileTypes.test(file.mimeType);

  if (extension_name || mimeType) {
    return cb(null, true);
  } else {
    let error;
    cb(error);
    //cb('Somente PDFs são permitidos!');
  }
};

function fnDisplayImage(res, associateImages) {
  let imagePath;
  let filePath;
  let fileExist;

  associateImages.forEach(async (image) => {
    imagePath = '\\' + image.image_url;
    fileName = image.image_name;
    filePath = path.join('./', imagePath);
    fileExist = fs.existsSync(filePath);
  });

  if (fileExist) {
    fs.readFile(filePath, (async (error) => {
      if (error) {
        return fnRedirectPages.render500(res, error);
      } else {
        try {
          fnRedirectPages.renderDisplayDocs(res, associateImages);
        } catch (err) {
          fnRedirectPages.render500(res, err);
        }
      }
    }));
  } else {
    fnRedirectPages.renderDisplayDocs(res, associateImages);
  }
}

function tipoDocFormatter(doc) {
  let docTipo = [
    'assinaturaCompromisso',
    'comprovanteVacina',
    'comprovanteResidencia',
    'copiaCPF',
    'copiaCNH',
    'copiaRG',
  ];

  if (docTipo.includes(doc)) {
    if (doc == 'assinaturaCompromisso') {
      doc = 'Assinatura do Termo de Compromisso';
      return doc;
    }
    if (doc == 'comprovanteVacina') {
      doc = 'Comprovante de Vacinação';
      return doc;
    }
    if (doc == 'comprovanteResidencia') {
      doc = 'Comprovante de Residência';
      return doc;
    }
    if (doc == 'copiaCPF') {
      doc = 'Cópia do CPF';
      return doc;
    }
    if (doc == 'copiaCNH') {
      doc = 'Cópia da CNH';
      return doc;
    }
    if (doc == 'copiaRG') {
      doc = 'Cópia do RG';
      return doc;
    }
  }
}

async function newDelete(res, associateImages, fileName) {
  let dirUploads = '/src/uploads/';
  let dirPath = path.resolve('./' + dirUploads);
  let fileSelect = sanitize(fileName);
  let file_select_path = path.join(dirPath, fileSelect);
  let file_select_exist = fs.existsSync(file_select_path);

  if (file_select_exist) {
    fs.unlink(file_select_path, (async (error) => {
      if (error) {
        return fnRedirectPages.render500(res, error);
      } else {

        associateImages.forEach(async (image) => {
          try {
            if (image.image_name == fileName) {
              await image.destroy();

              return res.redirect(`/user/index_Aluno?success=` + encodeURIComponent('success_del'));

            }
          } catch (error) {
            return fnRedirectPages.render500(res, error);
          }
        });
      }
    }));
  } else {
    let error = new Error(`Nenhum arquivo foi encontrado encontrado para ser excluído`);
    console.log(error);
    return res.redirect(`/user/index_Aluno?error=` + encodeURIComponent('no_file_found'));

  }
}

//Aluno
const createImage = async (req, res, next) => {
  const token_atual = req.cookies["x-access-token"];
  const aluno = await Cookie_Verifier.aluno_found(token_atual);
  if (!aluno) return fnRedirectPages.alunoNull(res);

  if (token_atual && aluno) {
    if (req.file === undefined) {
      let error = new Error(`O aluno de id "${aluno.id}" forneceu um arquivo diferente de um PDF`);
      console.log('Error:', error);

      return res.redirect(`/user/upload?error=` + encodeURIComponent('no_file'));

    } else {
      const { nomeDoc } = req.body;
      const { filename, mimetype } = req.file;
      const filepath = req.file.path;

      const filenameFormatado = filename.replace(/\s/g, "");
      const fileNameSanitize = sanitize(filenameFormatado);

      const filepathFormatado = filepath.replace(/\s/g, "");
      const filepathSanitize = sanitize(filepathFormatado);

      let tipoFormatado = tipoDocFormatter(nomeDoc);

      const img = await Index.Image.create({
        aluno_id: aluno.id,
        nome_doc: tipoFormatado,
        // Img
        image_url: filepathSanitize,
        image_name: fileNameSanitize,
        image_type: mimetype

      }).catch((error) => { return fnRedirectPages.render500(res, error); });

      if (img) {
        return res.redirect(`/user/upload?success=` + encodeURIComponent('success_up'));
      } else {
        let error = new Error(`O aluno de id ${aluno.id} não possui permissão para acessar está função`);
        console.log(error);
        return res.redirect(`/user/upload?error=` + encodeURIComponent('fail_up'));
      }
    }
  } else {
    return res.redirect('/login?error=tokenExp');
  }
};

async function deleteFunction(req, res, next) {
  const token = req.cookies['x-access-token'];
  const aluno = await Cookie_Verifier.aluno_found(token);

  if (!aluno) return fnRedirectPages.alunoNull(res);

  const aluno_img = await aluno.getCreated_by();

  const { fileName } = req.body;

  if (aluno_img) {
    newDelete(res, aluno_img, fileName);
  } else {
    return res.redirect(`/user/index_Aluno?error=` + encodeURIComponent('fail_del'));

  }
}

// Supervisor
async function displayDocs(req, res, next) {
  const token_atual = req.cookies["x-access-token"];
  const user_id = Cookie_Verifier.userIdToken(token_atual);
  const user = await Index.User.findByPk(user_id);

  if (!user) return fnRedirectPages.userNull(res);

  const img = await Index.Image.findAll({
    include: {
      association: 'created_by',
      required: true
    }
  });

  if (img !== '') {
    return fnDisplayImage(res, img);
  } else {
    return fnRedirectPages.renderDisplayDocs(res, '');
  }
}

async function updateDocStatus(req, res, next) {
  const token_atual = req.cookies["x-access-token"];
  const user_id = Cookie_Verifier.userIdToken(token_atual);
  const user = await Index.User.findByPk(user_id);

  if (!user) return fnRedirectPages.userNull(res);

  const { updStatus, selectedRow } = req.body;

  if ((updStatus || selectedRow) == undefined) {
    return res.redirect(`/user/docs/pendentes?error=` + encodeURIComponent('no_file'));
  }

  let newString = updStatus.toString().split(",");

  let array = newString.filter((str) => {
    return /\S/.test(str);
  });

  if (array == '' || array.includes('')) {
    // Caso não tenha nenhum doc
    return res.redirect('/user/docs/pendentes');

  } else if (array.includes('true')) {
    // Se tiver pelo menos 1 true, todos serão true

    // Sempre true, independente se tiver um false no meio
    // TODO Descobrir como resolver
    let allTrue = Object.values(array).every(item => item);

    const img = await Index.Image.update({
      validado: allTrue
    }, {
      where: {
        id: selectedRow
      }
    }).catch((error) => {
      console.log("ERROR: ", error);
      return res.redirect(`/user/docs/pendentes?error=` + encodeURIComponent('no_file'));
    });

    if (img) {
      return res.redirect(`/user/docs/pendentes?success=` + encodeURIComponent('success_updt'));
    } else {

    }

  } else if (array.includes('false')) {
    // Se tiver pelo menos 1 false, todos serão false
    let allTrue = Object.values(array).every(item => item);

    let allFalse = !allTrue;

    const img = await Index.Image.update({
      validado: allFalse
    }, {
      where: {
        id: selectedRow
      }
    }).catch((error) => {
      console.log("ERROR: ", error);
      return res.redirect(`/user/docs/pendentes?error=` + encodeURIComponent('no_file'));
    });

    if (img) {
      return res.redirect(`/user/docs/pendentes?success=` + encodeURIComponent('success_updt'));
    }
  }
}

module.exports = {
  imageFilter,
  createImage,
  deleteFunction,
  displayDocs,
  updateDocStatus
};
