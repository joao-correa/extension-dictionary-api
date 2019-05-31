//const service = require( "../business/services/yandex-translate-api" );
const service = require( "../business/request" );

exports.getTranslation = async ( req, res, next ) => {
    try {
        console.log( req.body );
        var results = await service.getTranslation( req );
        res.status( 200 ).send( results );
    } catch ( error ) {
        res.status( 500 ).send( {
            message: "Falha na requisicao",
            error: error
        } );
    }
};

exports.getLangs = async ( req, res, next ) => {
    try {
        var result = await service.getLangs( req );
        res.status( 200 ).send( result );
    } catch ( e ) {
        res.status( 400 ).send( {
            message: "Falha na requisicao",
            error: e
        } );
    }
}