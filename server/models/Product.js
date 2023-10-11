const mongoose = require('mongoose');
const Category = require('./Category');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  price: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  recommendedFor: {
    type: String,
    enum: ['men', 'women', 'both'],
    default: 'both',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
