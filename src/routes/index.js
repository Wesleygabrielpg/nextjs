const express = require('express');

const router_get = require('./router_get');
const router_post = require('./router_post');

const index = express.Router();

index.use(router_get);
index.use(router_post);

module.exports = index;
