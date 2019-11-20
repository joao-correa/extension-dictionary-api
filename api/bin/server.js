console.log( "Inicializando servidor..." );
console.log( "..." );

// DECLARE VARIABLES
let app = require( '../src/app' );
let debug = require( 'debug' )( 'node:server' );
let http = require( 'http' );
let port = normalizePort( process.env.PORT || "3000" )  //3000;
let server;

app.set( 'port', port );

server = http.createServer( app );
server.listen( port );
server.on( 'error', onError );
server.on( "listening", onListening );

function normalizePort( val ) {
	let port = parseInt( val, 10 );

	if ( isNaN( port ) )
		return val;

	if ( port >= 0 )
		return port;

	return false;
}

function onError( error ) {
	if ( error.syscall !== 'listen' ) 
		throw error;

	let bind = typeof port === "string" ?
		'Pipe' + port :
		'Port' + port;

	switch ( error.code ) {
		case 'EACCES':
			console.error( bind + ' require elevated privileges' );
			process.exit( 1 );
			break;
		case 'EADDRINUSE':
			console.log( bind + ' is already in use' );
			process.exit( 1 );
			break;
		default:
			throw error;
	}
}

function onListening() {
	let addr = server.address();
	let bind = typeof addr === "string"
		? 'pipe ' + addr
		: 'port ' + addr.port;

	debug( 'Listening on ' + bind );
}

console.log( 'Servidor Inicializado...' );
console.log( "..." );