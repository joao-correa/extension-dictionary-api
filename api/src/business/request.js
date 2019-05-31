let requestExport = ( () => {

    // ITS HOW A PRIVATE VARIABLE
    const RequestLimit = require( "../repositories/requestLimit-repository" );
    const Request = require( "../repositories/request-repository" );
    const User = require( "../repositories/user-repository" );
    const Yandex = require( "./services/yandex-translate-api" );

    // ITS HOW A PRIVATE METHOD
    async function createUser( hostName ) {
        await User.create( {
            host: hostName
        } );
    }

    async function createRequest( hostName ) {
        let hostId = undefined;

        hostId = await User.findByHost( hostName );

        if ( !hostId ) {

            await createUser( hostName );

            // GAMBIARRA OR FEATURE
            ( () => {
                let me = async () => {
                    hostId = await User.findByHost( hostName );

                    if ( hostId || false ) {
                        Request.create( {
                            user: hostId._id
                        } );

                        return;
                    } else {
                        setTimeout( () => {
                            me();
                        }, 5000 );
                    }
                }

                me();
            } )();

        } else {
            Request.create( {
                user: hostId._id
            } );
        }

    }

    async function updateRequestDate( hostName ) {
        let hostId = await User.findByHost( hostName );
        User.updateDate( hostId, Date.now );
    }

    function valideLimiteRequest() {
        return true
    }

    // ITS HOW A PUBLIC METHOD
    return {
        getTranslation: async ( req ) => {

            let yandexResponse;

            // GET USER GUID
            let hostIdentifier = req.headers[ "x-browser-identifier" ];
            hostIdentifier = hostIdentifier || "";

            // VALIDATE USER GUID
            if ( hostIdentifier.length === 0 ) {
                throw "host identifier not present";
            }

            console.log( "HOSTNAME " + hostIdentifier );

            // CREATE A REQUEST REGISTER
            createRequest( hostIdentifier );

            // UPDATE DATE LAST REQUEST
            updateRequestDate( hostIdentifier );

            // GET TRANSLATION E SEND TO USER 
            yandexResponse = await Yandex.getTranslation( req.body );
            return yandexResponse;

        },
        getLangs: async ( req ) => {

            let hostIdentifier = req.headers[ "x-browser-identifier" ];
            let yandexResponse;

            hostIdentifier = hostIdentifier || "";

            if ( hostIdentifier.length === 0 ) {
                throw "host identifier not present"
            }

            console.log( "HOSTNAME " + hostIdentifier );

            // CREATE A REQUEST REGISTER
            createRequest( hostIdentifier );

            // UPDATE DATE LAST REQUEST
            updateRequestDate( hostIdentifier );

            // GET LANGS E SEND TO USER 
            yandexResponse = await Yandex.getLangs();
            return yandexResponse;

        }
    }

} )();

module.exports = requestExport;