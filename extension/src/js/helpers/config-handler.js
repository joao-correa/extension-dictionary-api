import { Idiomas } from "./idiomas.js";
import { StorageManager } from "./localStorage.js";

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
        StorageManager.remove( "options" , "DictLanguage" );
        StorageManager.add( "options", JSON.stringify(arrayLangagues) , "DictLanguage" );

        return template;

    }

    static  saveOption( choiceObject ){

        let languages = StorageManager.select( "options" , "DictLanguage" );
        let fromTo = `${choiceObject.from}-${choiceObject.to}`;

        languages = JSON.parse(languages.options || []); 

        if( languages.includes( fromTo.toLowerCase() ) ){
    
            StorageManager.remove( "config" , "DictLanguage" );
            StorageManager.remove( "config-object" , "DictLanguage" );
    
            StorageManager.add( "config" , fromTo , "DictLanguage" );
            StorageManager.add( "config-object" , choiceObject , "DictLanguage" );
    
            return {
                response : true,
                message : "Configuracoes salvas com sucesso"
            };

        }

        return {
            response : true,
            message : "Nao foi possivel salvar suas configuracoes"
        };

    }

    static select( property, collection ){

        let options = StorageManager.select( property , collection );
        return options || {};

    }

};

export { Config as Config };