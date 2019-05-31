const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let schema = new Schema({
    byDay : {
        type : Number,
        required : true
    },
    byWeek : {
        type : Number,
        required : true
    },
    byMonth : {
        type : Number,
        required : true
    }
});

module.exports = mongoose.model( "RequestLimit", schema );