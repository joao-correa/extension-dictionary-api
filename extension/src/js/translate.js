var translate = ( function () {

    let url = "http://localhost:3000/dictionary/";
    let lang = "en-pt";

    return {
        fetch: function ( text ) {
            return new Promise( function ( resolve, reject ) {

                let browserIdentifier = storageManager.getGUID();
                let fetchHeader ;

                text = encodeURI( text );
                
                fetchHeader = new Headers( {
                    "x-browser-identifier": browserIdentifier, 
                    "Content-Type": "application/json",                    
                } );

                fetch( url, {
                    method: "POST",
                    headers: fetchHeader,
                    body : JSON.stringify({
                        "text" : text,
                        "lang" : lang
                    })
                } ).then( function ( response ) {
                    return response.json();
                } ).then( function ( json ) {
                    resolve( json );
                } );

            } );
        }
    }

} )();