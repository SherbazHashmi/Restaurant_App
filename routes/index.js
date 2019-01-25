const express = require('express');
const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');
// Object destructuring that will allow us to import entire object
const router = express.Router();

// Do work here
router.get('/', storeController.homePage);
router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));

router.get('/reverse/:name/?:lastname', (req, res) => {
  const first = [...req.params.name].reverse().join('');
  const last = req.params.lastname;
  console.log(`${first} ${last}`);
  console.log(`${req.params}`);
  res.send(`${first} ${last}`);
});
module.exports = router;
