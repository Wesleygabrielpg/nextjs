const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const appRoot = require('app-root-path');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const loginController = require('./login_Controller');

require('dotenv-safe').config();

const app = express();

app.use(helmet());
app.use(cors());
app.options('*', cors());

app.use(cookieParser());
//app.use(csurf({ cookie: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.text({ extended: true }));
app.use(express.static(path.join(__dirname, '../views')));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', './views');

const PORT = process.env.PORT || 5050;

app.use("/", loginController);


app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));