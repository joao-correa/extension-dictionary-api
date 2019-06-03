import { Idiomas } from "./idiomas.js";
import { storageManager } from "./localStorage.js";

class Config {

    static createOptionTemplate( arrayLangagues ) {

        let idiomas = [];
        let template = "";

        arrayLangagues = arrayLangagues || [];

        if ( arrayLangagues.length == 0 ) {
            throw "Nenhum idioma disponivel para escolha.";
        }

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

        // ARMAZERNAR AS OPCOES
        storageManager.remove( "options" , "Dict-Language" );
        storageManager.add( "options", arrayLangagues , "Dict-Languages" );

        return template;

    }

    static  saveOption( choiceObject ){

        let languages = storageManager.select( "options" , "Dict-Languages" );
        let fromTo = `${choiceObject.fromSigla}-${choiceObject.toSigla}`;

        if( languages.includes( fromTo.toLocaleLowerCase() ) ){
            storageManager.remove( "config" , "Dict-Languages" );
            storageManager.add( "config" , fromTo , "Dict-Languages" );
            storageManager.remove( "config-object" , "Dict-Languages" );
            storageManager.add( "config-object" , choiceObject , "Dict-Languages" );
            return true;
        }

        return false;

    }

    static  getOption(){

        let options = storageManager.select( "config-object", "Dict-Languages");
        return options || {};

    }

};

export { Config as Config };