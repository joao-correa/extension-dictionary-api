function uuidv4() {
    return ( [ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11 ).replace( /[018]/g, c =>
        ( c ^ crypto.getRandomValues( new Uint8Array( 1 ) )[ 0 ] & 15 >> c / 4 ).toString( 16 )
    )
}

var storageManager = ( function () {

    var local = window.localStorage;
    var key = 'Dictionary';
    var verifySupport;

    verifySupport = function() {
        if ( typeof ( Storage ) == "undefined" ) {
            throw "localStorage is not supported";
        } else {
            return true;
        }
    };

    if ( verifySupport() ) {
        local.setItem( key, local.getItem( key ) || JSON.stringify( {} ) );
    }

    return {
        add: function ( identificador, objeto ) {
            if ( verifySupport() ) {

                let armazenados = local.getItem( key );
                let identificadores;

                armazenados = JSON.parse( armazenados );
                identificadores = Object.keys( armazenados );

                if( identificadores.indexOf( identificador ) == -1 ){
                    armazenados[ identificador ] = objeto;
                }

                localStorage.setItem( key, JSON.stringify( armazenados ) );

                return identificador;

            }
        },
        remove: function ( identificador ) {
            if ( verifySupport() ) {

                let armazenados = local.getItem( key );
                let identificadores;

                armazenados = JSON.parse( armazenados );
                identificadores = Object.keys( armazenados );

                if( identificadores.indexOf( identificador ) != -1 ){
                    delete armazenados[ identificador ];
                }

                localStorage.setItem( key, JSON.stringify( armazenados ) );

                return identificador;

            }
        },
        select : function( identificador ){
            if ( verifySupport() ) {

                let armazenados = local.getItem( key );
                let identificadores;
                let retorno = { find: false , identificador : {} };

                armazenados = JSON.parse( armazenados );
                identificadores = Object.keys( armazenados );

                if( identificadores.indexOf( identificador ) != -1 ){
                    retorno.find = true;
                    retorno[ identificador ] = armazenados[ identificador ];
                }  

                return retorno;

            }
        },
        list : function(){
            if ( verifySupport() ) {

                let armazenados = local.getItem( key );
                let retorno = [];

                armazenados = JSON.parse( armazenados );
                identificadores = Object.keys( armazenados );

                identificadores.forEach(identificador => {
                    retorno.push( armazenados[ identificador ] );
                });

                return retorno.reverse();

            }
        },
        putFirst : async function( identificador ){
            if( verifySupport() ){

                let selected = this.select( identificador );
                this.remove( identificador );
                this.add( identificador , selected[ identificador ] );

            }
        },
        getGUID : function(){
            
            let guid = local.getItem( "UserGuid" );
            guid = guid || uuidv4();
            local.setItem( "UserGuid" , guid );
            return guid;

        }
    }

} )();