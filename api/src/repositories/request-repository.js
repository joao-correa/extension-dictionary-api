let Request = require("../models/request-model");

exports.find = async ()=>{
    let response = await Request.find({});
    return response;
}

exports.create = async ( requestObject ) => {
    let RequestObject = new Request( requestObject );
    RequestObject.save();
}

exports.findByHost = async ( host )=> {
    let result = await Request.find( {
        user : host
    } ).populate;
    return result;
}