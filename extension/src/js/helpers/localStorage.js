var storageManager = ( function () {

	var local = window.localStorage;
	var verifySupport;

	function uuidv4() {
		return ( [ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11 ).replace( /[018]/g, c =>
			( c ^ crypto.getRandomValues( new Uint8Array( 1 ) )[ 0 ] & 15 >> c / 4 ).toString( 16 )
		)
	}

	verifySupport = function ( collection ) {
		if ( typeof ( Storage ) == "undefined" ) {
			throw "localStorage is not supported";
		} else {
			local.setItem( collection, local.getItem( collection ) || JSON.stringify( {} ) );
			return true;
		}
	};

	return {
		add: function ( propriedade, objeto, collection = "Dictionary" ) {
			if ( verifySupport( collection ) ) {

				let armazenados = local.getItem( collection );
				let propriedades;

				armazenados = JSON.parse( armazenados );
				propriedades = Object.keys( armazenados );

				if ( !propriedades.includes( propriedade ) ) {
					armazenados[ propriedade ] = objeto;
				}

				localStorage.setItem( collection, JSON.stringify( armazenados ) );

				return propriedade;

			}
		},
		remove: function ( propriedade, collection = "Dictionary" ) {
			if ( verifySupport( collection ) ) {

				let armazenados = local.getItem( collection );
				let propriedades;

				armazenados = JSON.parse( armazenados );
				propriedades = Object.keys( armazenados );

				if ( propriedades.includes( propriedade ) ) {
					delete armazenados[ propriedade ];
				}

				localStorage.setItem( collection, JSON.stringify( armazenados ) );

				return propriedade;

			}
		},
		select: function ( propriedade, collection = "Dictionary" ) {
			if ( verifySupport( collection ) ) {

				let armazenados = local.getItem( collection );
				let propriedades;
				let retorno = { find: false, propriedade: {} };

				armazenados = JSON.parse( armazenados );
				propriedades = Object.keys( armazenados );

				if ( propriedades.includes( propriedade ) ) {
					retorno.find = true;
					retorno[ propriedade ] = armazenados[ propriedade ];
				}

				return retorno;

			}
		},
		list: function ( collection = "Dictionary" ) {
			if ( verifySupport( collection ) ) {

				let armazenados = local.getItem( collection );
				let propriedades;
				let retorno = [];

				armazenados = JSON.parse( armazenados );
				propriedades = Object.keys( armazenados );

				propriedades.forEach( propriedade => {
					retorno.push( armazenados[ propriedade ] );
				} );

				return retorno.reverse();

			}
		},
		putFirst: async function ( propriedade, collection = "Dictionary" ) {
			if ( verifySupport( collection ) ) {

				let selected = this.select( propriedade, collection );
				this.remove( propriedade, collection );
				this.add( propriedade, selected[ propriedade ], collection );

			}
		},
		getGUID: function () {

			let guid = local.getItem( "UserGuid" );
			guid = guid || uuidv4();
			local.setItem( "UserGuid", guid );
			return guid;

		}
	}

} )();

export { storageManager as StorageManager };