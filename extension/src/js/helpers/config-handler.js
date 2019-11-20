import { Idiomas } from "./idiomas.js";
import { StorageManager } from "./localStorage.js";
import { Translate } from "./translate.js";

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

		idiomas.sort( function ( a, b ) {
			return ( Idiomas[ a ] || a ) > ( Idiomas[ b ] || b ) ? 1 : -1;
		} );

		idiomas.forEach( ( item ) => {
			template += `<option value=${ item }> ${ Idiomas[ item ] || item } </option>`;
		} );

		// ARMAZERNAR AS OPCOES
		StorageManager.remove( "options", "DictLanguage" );
		StorageManager.add( "options", JSON.stringify( arrayLangagues ), "DictLanguage" );

		return template;

	}

	static async saveOption( choiceObject ) {

		let languages = StorageManager.select( "options", "DictLanguage" );
		let fromTo = `${ choiceObject.from }-${ choiceObject.to }`;

		if( languages && languages.options )
			languages = JSON.parse(languages.options);
		else 
			languages = [];

		if ( languages.length == 0 ) {
			let lang = await Translate.languages();
			( Config.saveLanguages )( lang );
			languages = lang;
		}

		try {

			if ( languages.includes( fromTo.toLowerCase() ) ) {
				StorageManager.remove( "config", "DictLanguage" );
				StorageManager.remove( "config-object", "DictLanguage" );

				StorageManager.add( "config", fromTo.toLowerCase(), "DictLanguage" );
				StorageManager.add( "config-object", choiceObject, "DictLanguage" );
			}

			return {
				response: true,
				message: "Configuracoes salvas com sucesso"
			};

		} catch ( ex ) {
			return {
				response: true,
				message: "Nao foi possivel salvar suas configuracoes"
			};
		}

	}

	static saveLanguages( languages ) {

		languages = languages || [];

		if ( languages.length == 0 ) {
			throw "Nenhum idioma disponivel para escolha.";
		}

		// ARMAZERNAR AS OPCOES
		StorageManager.remove( "options", "DictLanguage" );
		StorageManager.add( "options", JSON.stringify( languages ), "DictLanguage" );

	}

	static select( property = "config-object", collection = "DictLanguage" ) {

		let options = StorageManager.select( property, collection );
		return options || {};

	}

};

export { Config as Config }; ``