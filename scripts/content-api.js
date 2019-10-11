const server = require('./../packages/news-server');
const path = require('path');

server(3005, path.resolve(__dirname, '../news'));
