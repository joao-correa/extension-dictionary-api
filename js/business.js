$( document ).ready( function () {

    $( "#btnTraduzir" ).click( function ( e ) {

        setAnimation();

        translate.fetch( $( "#txtTranslate" ).val() )
            .then( ( json ) => {

                handlerResponse( json );
                resetAnimation();

            } ).catch( () => {

                resetAnimation();

            } );

        e.preventDefault();

    } );

} );

function setAnimation() {
    var btn = $( "#btnTraduzir" );
    btn.attr( "disabled", "disabled" );
    btn.find( ".not-loading" ).fadeOut( 'fast', function () {
        btn.find( ".loading" ).fadeIn( "fast" );
    } );
}

function resetAnimation() {
    var btn = $( "#btnTraduzir" );
    btn.removeAttr( "disabled" );
    btn.find( ".loading" ).fadeOut( 'fast', function () {
        btn.find( ".not-loading" ).fadeIn( "fast" );
    } );
}

function successMessage( mensagem ) {
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

function failMessage( mensagem ) {
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

function handlerResponse( json ) {

    $( "#resultContainer" ).empty();

    json.def.forEach( block => {
        handlerBlockDictionary( block );
    } );

}

function handlerBlockDictionary( block ) {

    block.tr.forEach( i => {

        let word = "";
        let wordTranslated = "";
        let type = "";
        let sinonimos = [];

        wordTranslated = i.text;
        type = replaceWord( i.pos );
        word = block.text.toString();

        i.syn = i.syn || [];
        i.syn.forEach( sinonimo => {
            sinonimos.push( sinonimo.text );
        } );

        setUserInterface( word, wordTranslated, type, sinonimos );

    } );

}

function replaceWord( word ) {

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

function setUserInterface( word, wordTranslated, type, sinonimos ) {

    var template = `<span class="font-weight-bold"> ${ word } - ${ wordTranslated } - </span> <span class="${ type }">  ${ type } </span> <br>`;
    $( "#resultContainer" ).append( $( template ) );
    
    if( sinonimos.length > 0 ){
        var templateSinonimos = "<span class='Sinonimo'> Sinônimos: </span> <span class='default'> {0} </span> <br>".format( sinonimos.join( ", " ) );
        $( "#resultContainer" ).append( $( templateSinonimos ) );
    }

    $( "#resultContainer" ).append( $( "<hr>" ) );

}