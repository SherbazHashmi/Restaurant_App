/* eslint-disable function-paren-newline */
const express = require('express');
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const { catchErrors } = require('../handlers/errorHandlers');
// Object destructuring that will allow us to import entire object
const router = express.Router();

// Do work here
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);
router.get('/remove', storeController.removeStore);
router.post('/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore),
);
router.get('/store/:slug', catchErrors(storeController.getStore));
router.post('/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.editStore),
);
router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.get('/storesjson', storeController.getStoresJSON);

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

// User Routes
router.get('/login', userController.loginForm);
router.get('/register', catchErrors(userController.registerForm));
router.post('/register', userController.validateRegister);
module.exports = router;
