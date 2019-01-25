/* eslint-disable func-names */
const mongoose = require('mongoose'); // Importing Mongoose
const slug = require('slugs'); // Allows us to make URL friendly names for our slugs

mongoose.Promise = global.Promise; // Setting Promise

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!',
  },

  slug: String,
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
});


storeSchema.pre('save', function (next) {
  if (!this.isModified('name')) {
    return next();
  }
  this.slug = slug(this.name);
  return next();
});

module.exports = mongoose.model('Store', storeSchema);
