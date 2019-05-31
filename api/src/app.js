// STARTING VARIABLES
let express = require( 'express' );
let bodyParser = require( 'body-parser' );
let indexRoute = require( "./routes/index" );
let dictionaryRoute = require( "./routes/dictionary" );
let mongoose = require( "mongoose" );
let config = require("./config");
let app;

// DATABASE CONNECTION
mongoose.connect ( config.connectionString );

// APP SETTINGS
app = express();
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );

// Habilita o CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-browser-identifier');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// APP SETTINGS ROUTES
app.use( "/dictionary", dictionaryRoute );
app.use( "/"  , indexRoute );

module.exports = app;