console.log('Inicializando servidor...');

const http = require('http');
const app = require('../src/app');

const port = Number(process.env.PORT) || '3000';

app.set('port', port);

const server = http.createServer(app);

server.listen(port);

console.log('Servidor Inicializado...');
