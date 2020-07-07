const Request = require('../models/request-model');

exports.find = () => Request.find({});

exports.create = (requestObject) => {
  const RequestObject = new Request(requestObject);
  RequestObject.save();
};

exports.findByHost = (host) => Request.find({
  user: host,
}).populate;
