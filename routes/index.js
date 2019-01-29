const express = require('express');
const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');
// Object destructuring that will allow us to import entire object
const router = express.Router();

// Do work here
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));

module.exports = router;
