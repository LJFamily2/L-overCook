const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;