// Imports
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const appRoot = require('app-root-path');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
//const csurf = require('csurf');

// Routes
const Index_Router = require('./src/routes/index');

require('dotenv-safe').config();
require('./src/database');

const app = express();

app.use(helmet());
app.use(cors());
app.options('*', cors());

app.use(
  // Qual fonte externa o app(website) pode pegar recursos. Qualquer fonte q não estiver aqui é bloqueada
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],

      "script-src": ["'self'",
        "*.googleapis.com", "cdnjs.cloudflare.com",
        "www.gstatic.com", "maxcdn.bootstrapcdn.com",
        "cdn.jsdelivr.net", "cdn.datatables.net",
        "code.jquery.com"

      ],

      "style-src": ["'self'", "fonts.googleapis.com", "cdnjs.cloudflare.com",
        "cdn.jsdelivr.net", "maxcdn.bootstrapcdn.com", "'unsafe-inline'",
        "cdn.datatables.net"
      ],

      "font-src": ["'self'",
        "fonts.gstatic.com", "fonts.googleapis.com",
        "maxcdn.bootstrapcdn.com", "cdn.jsdelivr.net",
        "cdn.datatables.net"
      ],

      "object-src": ["'self'",
        "drive.google.com", "cdn.datatables.net"
      ],

      connectSrc: ["'self'"],

      imgSrc: ["'self'",
        "maps.gstatic.com", "maps.googleapis.com", "data:",
        "images.unsplash.com", "drive.google.com"
      ],

      frameSrc: ["'self'",
        "maxcdn.bootstrapcdn.com", "cdn.jsdelivr.net",
        "cdn.datatables.net"
      ]
    }
  })
);

app.use(cookieParser());
//app.use(csurf({ cookie: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.text({ extended: true }));
app.use(express.static(path.join(__dirname, './public')));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', './public/views');

app.use(Index_Router);

app.use('/img', express.static('./src/uploads')); // Qualquer requisição que terminar em '/img' vai pegar o que tiver nessa pasta

module.exports = app;
