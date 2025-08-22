const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Peers', 'Central figures', 'Spousal relationship', 'Work force', 'Parenting', 'Children', 'Faith', 'Other'],
    default: 'Other'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  answer: {
    type: String,
    default: '',
  },
  answered: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Question', questionSchema); 