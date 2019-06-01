import { Idiomas } from "./idiomas.js";

class Config {

    static createOptionTemplate( arrayLangagues ) {

        let idiomas = [];
        let template = "";

        arrayLangagues = arrayLangagues || [];

        // VERIFICA SE O ARRAY E VALIDO
        if ( arrayLangagues.length == 0 ) {
            throw "Nenhum idioma disponivel para escolha.";
        }

        // SPLIT THE CODES;
        arrayLangagues.forEach( ( item ) => {
            item = item.split( "-" );

            if ( !idiomas.includes( item[ 0 ].toUpperCase() ) ) {
                idiomas.push( item[ 0 ].toUpperCase() );
            }

            if ( !idiomas.includes( item[ 1 ].toUpperCase() ) ) {
                idiomas.push( item[ 1 ].toUpperCase() );
            }
        } );

        idiomas.sort( function( a, b ) { 
            return ( Idiomas[ a ] || a ) > ( Idiomas[ b ] || b ) ? 1 : -1;
        } );

        idiomas.forEach( ( item ) => {
            template += `<option value=${ item }> ${ Idiomas[ item ] || item } </option>`;
        } );

        return template;

    }

    static  saveOption( choiceObject ){
    }

    static  getOption(){
    }

};

export { Config as Config };