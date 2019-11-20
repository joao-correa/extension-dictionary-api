import { StorageManager } from "./localStorage.js";
import { Config } from "./config-handler.js";

var translate = ( function () {

	let url = "http://localhost:3000/dictionary/"; // TODO: TORNAR ESSE URL UM PARAMETRO CONFIGURAVEL 
	let lang = "";

	function getHeader() {
		let browserIdentifier = StorageManager.getGUID();
		let fetchHeader = new Headers( {
			"x-browser-identifier": browserIdentifier,
			"Content-Type": "application/json",
		} );

		return fetchHeader;
	}

	return {
		fetch: function ( text ) {
			return new Promise( function ( resolve, reject ) {

				let { config } = Config.select( 'config' );

				lang = config;
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
		languages: function () {
			return new Promise( function ( resolve, reject ) {
				fetch( `${ url }langs`, {
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

export { translate as Translate };