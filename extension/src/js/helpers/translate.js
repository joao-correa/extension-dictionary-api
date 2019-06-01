import { storageManager } from "./localStorage.js";

var translate = ( function () {

    let url = "http://localhost:3000/dictionary/";
    let lang = "en-pt";

    function getHeader() {
        let browserIdentifier = storageManager.getGUID();
        let fetchHeader = new Headers( {
            "x-browser-identifier": browserIdentifier,
            "Content-Type": "application/json",
        } );

        return fetchHeader;
    }

    return {
        fetch: function ( text ) {
            return new Promise( function ( resolve, reject ) {

                text = encodeURI( text );

                fetch( url, {
                    method: "POST",
                    headers: getHeader(),
                    body: JSON.stringify( {
                        "text": text,
                        "lang": lang
                    } )
                } ).then( function ( response ) {
                    return response.json();
                } ).then( function ( json ) {
                    resolve( json );
                } );

            } );
        },
        languages: function ( text ) {
            return new Promise( function ( resolve, reject ) {

                text = encodeURI( text );

                fetch( `${url}langs`, {
                    method: "GET",
                    headers: getHeader()
                } ).then( function ( response ) {
                    return response.json();
                } ).then( function ( json ) {
                    resolve( json );
                } );

            } );
        },
    }

} )();

export { translate as translate };