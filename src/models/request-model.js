const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  requestDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model('Request', schema);
