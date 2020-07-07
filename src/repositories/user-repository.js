const User = require('../models/user-model');

exports.find = () => User.find({});

exports.create = (userObject) => {
  const userCreated = new User(userObject);
  userCreated.save();
};

exports.updateDate = (hostId, date) => {
  User.findByIdAndUpdate(hostId, {
    $set: {
      lastRequest: date,
    },
  });
};

exports.findByHost = (host) => User.findOne({
  host,
});
