const mongoose = require('mongoose');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFitler(req, file, next) {
    const isPhoto = file.mimetype.startsWidth('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That filetype isn\'t allowed!' }, false);
    }
  },

};


const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  console.log(req.name);
};


exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    next(); // will skip to next middleware
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;

  // now we resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);

  // once we have written our photo to our file system keep going!
  next();
};

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save();
  await store.save();
  req.flash('success', `Sucessfully Created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  // Query All Stores
  const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores });
};

exports.removeStore = async (req, res) => {
  const stores = await Store.find();
  res.render('removeStore', { title: 'Remove Store', stores });
};

exports.deleteStore = async (req, res) => {
  res.json(req.body);
};

exports.editStore = async (req, res) => {
  // 1. Find store given ID
  const { id } = req.params;
  const store = await Store.findById(id);

  // 2. Confirm they are owner of store
  // TODO
  // 3. Render out the edit form so the user can update their store
  res.render('editStore', { title: 'Edit Store', store });
};

exports.updateStore = async (req, res) => {
  // Set the location data to be a point
  console.log(req.body);
  req.body.location.type = 'Point';
  // find and update the store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // Return the new store instead of the old one
    runValidators: true, // this prevents someone updating the store to not fill required fields
  }).exec(); // exec will make it run query
  req.flash('success', `Successfully updated <strong> ${store.name}</strong>. <a href="/stores/${store.slug}"> View Store -> </a>"`);
  // eslint-disable-next-line no-underscore-dangle
  res.redirect(`/stores/${store._id}/edit`);
  // redirect them to the store and tell them it has been updated
};

exports.getStore = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug });
  if (!store) return next();
  res.render('showStore', { title: 'Show Store', store });
};

exports.getStoresJSON = async (req, res) => {
  const stores = await Store.find();
  res.json(stores);
};

exports.getStoresByTag = async (req, res) => {
  const { tag } = req.params;
  const tags = Store.getTagsList();
  const tagQuery = tag || { $exists: true };
  const stores = Store.find({ tags: tagQuery });
  const [tagData, storeData] = await Promise.all([tags, stores]);
  res.render('tags', { tags: tagData, tag, stores: storeData });
};
