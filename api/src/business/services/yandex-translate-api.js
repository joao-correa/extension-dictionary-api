const https = require( "https" );

var yandex = ( () => {

    const CONFIGS = require( "../../config" );

    function fetchTranslate( info ) {
        return new Promise( function ( resolve, reject ) {
            
            let fullUrl = `${ CONFIGS.yandexBaseUrl }lookup?key=${ CONFIGS.yandexApiKey }&lang=${ info.lang }&text=${ info.text }`;
            
            console.log( fullUrl + " -- Fecthing... " );

            https.get( fullUrl, ( resp ) => {
                let data = '';

                resp.on( 'data', ( chunk ) => {
                    data += chunk;
                } );

                resp.on( 'end', () => {
                    resolve( JSON.parse( data ) );
                } );

            } );

        } );
    }

    function fetchLangs() {
        return new Promise( function ( resolve, reject ) {
           
            let fullUrl = `${ CONFIGS.yandexBaseUrl }getLangs?key=${ CONFIGS.yandexApiKey }`;

            console.log( fullUrl + " -- Fecthing... " );

            https.get( fullUrl, ( resp ) => {
                let data = '';

                resp.on( 'data', ( chunk ) => {
                    data += chunk;
                } );

                resp.on( 'end', () => {
                    resolve( JSON.parse( data ) );
                } );
            } );

        } );
    }

    return {
        getTranslation: async ( info ) => {
            let response = await fetchTranslate( info );
            return response;
        },
        getLangs: async () => {
            let response = await fetchLangs();
            return response;
        }
    }

} )();

module.exports = yandex;