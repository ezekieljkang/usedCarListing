var express = require('express');
var router = express.Router();
const carController = require('../controllers/carController');

/* GET home page. */
router.get('/', carController.index);

module.exports = router;
