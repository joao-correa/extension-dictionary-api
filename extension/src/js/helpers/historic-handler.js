import { StorageManager } from "./localStorage.js";

class Historic {

	static get(collection = "Dictionary" ) {
		return StorageManager.list(collection);
	}

	static handler( json ) {
		var template = $( "<div id='historico'></div>" );

		json.forEach( item => {
			var from, to;
			from = "";
			to = [];

			item.def.forEach( def => {
				from = def.text;

				def.tr.forEach( traducao => {
					to.push( traducao.text );

					traducao.syn = traducao.syn || [];
					traducao.syn.forEach( sinonimos => {
						to.push( sinonimos.text );
					} );
				} );
			} );

			if ( item.def.length != 0 ) {
				template.append( $( "<p class=''> <span class='color-neutral'>{0}</span> - {1} </p>".format( from, to.join( ', ' ) ) ) );
			}
		} );

		return template;
	}

}

export { Historic as Historic };