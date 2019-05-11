$( document ).ready( function () {

    $( "#btnTraduzir" ).click( function ( e ) {
        try {

            e.preventDefault();
            Animation.init();

            var dict = new Dictionary();

            dict.fetch( $( "#txtTranslate" ).val() )
                .then( ( response ) => {

                    if ( Object.keys( response ).indexOf( "message" ) == -1) {
                        dict.handler( response );
                    }

                    Animation.finish();

                } ).catch( () => {
                    Animation.finish();
                } );

        } catch ( ex ) {
            Animation.finish();
        }
    } );

} );

class Animation {

    static init() {
        var btn = $( "#btnTraduzir" );
        btn.attr( "disabled", "disabled" );
        btn.find( ".not-loading" ).fadeOut( 'fast', function () {
            btn.find( ".loading" ).fadeIn( "fast" );
        } );
    }

    static finish() {
        var btn = $( "#btnTraduzir" );
        btn.removeAttr( "disabled" );
        btn.find( ".loading" ).fadeOut( 'fast', function () {
            btn.find( ".not-loading" ).fadeIn( "fast" );
        } );
    }

}

class Notify {

    static success() {
        let container = $( "#msgContainer" );
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
        let container = $( "#msgContainer" );
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
                translate.fetch( text )
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

        return replaces[ word ] || "default";
    }

    static appendResponse( template ) {
        $( "#resultContainer" ).append( $( template ) );
    }

    static clearResponses() {
        $( "#resultContainer" ).empty();
    }

    static teplateTraducao() {
        return '<span><span class="font-weight-bold"> {0} - {1}, </span> <span class="{2}"> {2} </span> </span> <br>' ;
    }

    static templateSinonimos() {
        return "<span> <span class='Sinonimo'> Sinônimos: </span> <span class='default'> {0} </span> </span><br>" ;
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