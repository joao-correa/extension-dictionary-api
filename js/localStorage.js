var storageManager = ( function () {

    var local = window.localStorage;
    var key = 'HistoricExclude';
    var supportVerify;

    supportVerify = function() {
        if ( typeof ( Storage ) == "undefined" ) {
            throw "localStorage is not supported";
        } else {
            return true;
        }
    };

    if ( supportVerify() ) {
        local.setItem( key, local.getItem( key ) || JSON.stringify( [] ) );
    }

    return {
        add: function ( url ) {
            if ( supportVerify() ) {

                let resultado = local.getItem( key );

                resultado = JSON.parse( resultado );
                resultado.push( url );
                
                localStorage.setItem( key, JSON.stringify( resultado ) );

            }
        },
        remove: function ( url ) {
            if ( supportVerify() ) {

                let itens = local.getItem( key );
                let index = -1;

                itens = JSON.parse( itens );
                index = itens.indexOf( url );

                if ( index >= 0 ) {
                    itens = itens.splice( index, 1 );
                    local.setItem( key, JSON.stringify( itens ) );
                }

            }
        },
    }

} )();