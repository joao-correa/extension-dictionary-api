import { Config } from "./helpers/config-handler.js";
import { Translate } from "./helpers/translate.js";
import { Historic } from "./helpers/historic-handler.js";
import { StorageManager } from "./helpers/localStorage.js";
import { Idiomas } from "./helpers/idiomas.js";

$( document ).ready( function () {

	UserInterface.setTitle();
	$( "#txtTranslate" ).focus();

	$( "#btnTranslate" ).on( "click", async ( e ) => {
		try {

			let dict = new Dictionary();
			let text = $( "#txtTranslate" ).val();
			let item, collectionName;

			if ( $.trim( text ).length == 0 || /.{1,}\s.{1,}/gi.test( text ) ) {
				$( "#ctnResult" ).slideUp();
				$( "#ctnHist" ).slideUp();
				e.preventDefault();
				return;
			}


			Animation.init();
			collectionName = Config.select( 'config' )[ 'config' ];
			item = StorageManager.select( $.trim( text ), collectionName );

			if ( !item.find ) {

				try {
					let response = await dict.fetch( text );
					dict.handler( response );
					StorageManager.add( $.trim( text ), response, collectionName );
				} catch ( ex ) {
					console.log( resposne );
				} finally {
					Animation.finish();
				}

			} else {

				dict.handler( item[ $.trim( text ) ] );
				StorageManager.putFirst( $.trim( text ), collectionName );
				Animation.finish();

			}

			$( "#ctnHist, #ctnConfig" ).slideUp( "fast", function () {
				$( "#ctnResult" ).slideDown( "fast" );
			} );

			e.preventDefault();

		} catch ( ex ) {
			Animation.finish();
		}
	} );

	$( "#btnHist" ).on( "click", ( e ) => {

		let collectionName = Config.select( 'config' )[ 'config' ];
		let retorno = Historic.get(collectionName);
		var template = Historic.handler( retorno );

		$( "#ctnHist" ).empty();
		$( "#ctnHist" ).append( template );

		$( "#ctnResult, #ctnConfig" ).slideUp( "fast", function () {
			$( "#ctnConsulta" ).slideDown( "fast", function () {
				$( "#ctnHist" ).slideDown( "fast" );
			} );
		} );

		e.preventDefault();

	} );

	$( "#btnHome" ).on( "click", ( e ) => {

		$( "#txtTranslate" ).val( "" );
		$( "#ctnHist" ).empty();

		$( "#ctnResult, #ctnConfig, #ctnHist" ).slideUp( "fast", function () {
			$( "#ctnConsulta" ).slideDown( "fast" );
		} );

		e.preventDefault();

	} );

	$( "#btnConfig" ).on( "click", async ( e ) => {

		$( "#ctnConsulta" ).slideUp( "fast", function () {
			$( "#ctnResult, #ctnHist" ).slideUp( "fast", function () {
				$( "#ctnConfig" ).slideDown( "fast" );
			} );
		} );

		let langs = await Translate.languages();
		let template = Config.createOptionTemplate( langs );

		$( "#slcFrom" ).append( $( template ) );
		$( "#slcTo" ).append( $( template ) );

		e.preventDefault();

	} );

	$( "#btnSaveConfig" ).on( "click", async ( e ) => {

		let data = {};
		let retorno = {};

		data.from = $( "#slcFrom" ).val();
		data.to = $( "#slcTo" ).val();

		retorno = await Config.saveOption( data );

		if ( !retorno.response ) {
			alert( retorno.message );
		} else {
			UserInterface.setTitle();
		}

		e.preventDefault();

	} );

} );

class Animation {

	static init() {
		var btn = $( "#btnTranslate" );
		btn.attr( "disabled", "disabled" );
		btn.find( ".not-loading" ).fadeOut( 'fast', function () {
			btn.find( ".loading" ).fadeIn( "fast" );
		} );
	}

	static finish() {
		setTimeout( function () {
			var btn = $( "#btnTranslate" );
			btn.removeAttr( "disabled" );
			btn.find( ".loading" ).fadeOut( 'fast', function () {
				btn.find( ".not-loading" ).fadeIn( "fast" );
			} );
		}, 250 );
	}

}

class Notify {

	static success() {
		let container = $( "#ctnMessage" );
		let htmlObjetc;
		let template = `<div class="alert alert-success alert-dismissible" role="alert">
											<span id="msgSuccess"></span>
											<button type="button" class="close" data-dismiss="alert" aria-label="Close">
												<span aria-hidden="true">&times;</span>
											</button>
										</div>`;

		htmlObjetc = $( template );
		htmlObjetc.find( "#msgSuccess" ).text( mensagem );
		container.append( htmlObjetc );
		htmlObjetc.fadeIn( "fast" );
	}

	static fail() {
		let container = $( "#ctnMessage" );
		let htmlObjetc;
		let template = `<div class="alert alert-danger alert-dismissible" role="alert">
											<span id="msgFail"></span>
											<button type="button" class="close" data-dismiss="alert" aria-label="Close">
												<span aria-hidden="true">&times;</span>
											</button>
                    </div>`;

		htmlObjetc = $( template );
		htmlObjetc.find( "#msgFail" ).text( mensagem );
		container.append( htmlObjetc );
		htmlObjetc.fadeIn( "fast" );
	}

}

class Dictionary {

	constructor () {
		this.keyLocalStorage = "";
		this.isValid = true;
		this.regex = /.{1,}\s.{1,}/gi;
	}

	fetch( text ) {
		let _this = this;

		return new Promise( function ( resolve, reject ) {

			_this.check( text );

			if ( _this.isValid ) {
				Translate.fetch( text )
					.then( ( json ) => { resolve( json ) } );
			} else {
				reject( { message: "The text is not valid." } );
			}

		} );
	}

	check( text ) {
		try {

			this.isValid = true;

			if ( $.trim( text ).length == 0 ) {
				this.isValid = false;
			}

			if ( this.regex.test( text ) ) {
				this.isValid = false;
			}

		} catch ( ex ) {
			this.isValid = false;
		}
	}

	handler( json ) {

		UserInterface.clearResponses();

		json.def.forEach( block => {

			block.tr.forEach( i => {

				let word = "";
				let wordTranslated = "";
				let type = "";
				let sinonimos = [];
				let template;

				word = block.text.toString();
				type = UserInterface.replaceTerms( i.pos );
				wordTranslated = i.text;

				i.syn = i.syn || [];
				i.syn.forEach( sinonimo => {
					sinonimos.push( sinonimo.text );
				} );

				template = UserInterface.teplateTraducao().format( word, wordTranslated, type );
				UserInterface.appendResponse( template );

				if ( sinonimos.length > 0 ) {
					template = UserInterface.templateSinonimos().format( sinonimos.join( ", " ) );
					UserInterface.appendResponse( template );
				}

				UserInterface.appendResponse( $( "<hr>" ) );

			} );

		} );

	}

}

class UserInterface {

	static replaceTerms( word ) {
		let replaces = {
			"noun": "Substantivo",
			"adverb": "Adverbio",
			"adjective": "Adjetivo",
			"verb": "Verbo",
			"preposition": "Preposicao",
			"pronoun": "Pronome",
		};

		return replaces[ word ] || "color-neutral";
	}

	static appendResponse( template ) {
		$( "#ctnResult" ).append( $( template ) );
	}

	static clearResponses() {
		$( "#ctnResult" ).empty();
	}

	static teplateTraducao() {
		return '<span><span class="color-neutral"> {0} - {1}, </span> <span class="{2}"> {2} </span> </span> <br>';
	}

	static templateSinonimos() {
		return "<span> <span class='Sinonimo'> Sinônimos: </span> <span class='color-neutral'> {0} </span> </span><br>";
	}

	static setTitle() {

		let configUser = Config.select( "config-object", "DictLanguage" );
		let title;

		if ( configUser.find ) {
			configUser = configUser[ "config-object" ];
		} else {
			configUser = {
				from: "EN",
				to: "PT"
			}
			Config.saveOption( configUser );
		}

		title = `${ Idiomas[ configUser.from.toUpperCase() ] }-${ Idiomas[ configUser.to.toUpperCase() ] }`;

		$( "#txtFromTo" ).text( title );

	}

}

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