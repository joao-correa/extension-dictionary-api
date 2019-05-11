var storageManager = ( function () {

    var local = window.localStorage;
    var key = 'HistoricExclude';
    var verifySupport;

    verifySupport = function() {
        if ( typeof ( Storage ) == "undefined" ) {
            throw "localStorage is not supported";
        } else {
            return true;
        }
    };

    if ( verifySupport() ) {
        local.setItem( key, local.getItem( key ) || JSON.stringify( [] ) );
    }

    return {
        add: function ( url ) {
            if ( verifySupport() ) {

                let resultado = local.getItem( key );

                resultado = JSON.parse( resultado );
                resultado.push( url );
                
                localStorage.setItem( key, JSON.stringify( resultado ) );

                return url;

            }
        },
        remove: function ( url ) {
            if ( verifySupport() ) {

                let itens = local.getItem( key );
                let index = -1;

                itens = JSON.parse( itens );
                index = itens.indexOf( url );

                if ( index >= 0 ) {
                    itens = itens.splice( index, 1 );
                    local.setItem( key, JSON.stringify( itens ) );
                }

                return url;

            }
        },
    }

} )();