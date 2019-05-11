var translate = ( function () {

    let apiKey = "dict.1.1.20190511T033105Z.5b0a1156a3f79275.6d71531480a1b3556c1c022f6d928354b44340d7"
    let url = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key={0}&lang={1}&text={2}";
    let lang = "en-pt";

    return {
        fetch: function ( text ) {
            return new Promise( function ( resolve, reject ) {

                text = encodeURI( text );
                let urlRequest= url.format( apiKey, lang, text );

                fetch( urlRequest ).then( function ( response ) {
                    return response.json();
                } ).then( function ( json ) {
                    resolve( json );
                } );;

            } );
        }
    }

} )();

if ( !String.prototype.format ) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace( /{(\d+)}/g, function ( match, number ) {
            return typeof args[ number ] != 'undefined'
                ? args[ number ]
                : match
                ;
        } );
    };
}