let user = require( "../models/user-model" );

exports.find = async () => {
    let response = await user.find( {} );
    return response;
}

exports.create = async ( userObject ) => {
    var userObject = new user( userObject );
    await userObject.save();
}

exports.updateDate = ( hostId, date ) => {
    user.findByIdAndUpdate( hostId, {
        $set: {
            lastRequest: date
        }
    } );
}

exports.findByHost = async ( hostName ) => {
    let result = await user.findOne( {
        host: hostName
    } );
    return result;
}