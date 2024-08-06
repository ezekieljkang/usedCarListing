var express = require('express');
var router = express.Router();
const car_controller = require('../controllers/carController');

// Car routes
router.get('/cars', car_controller.car_list);
router.get('/cars/:id', car_controller.car_detail);
router.get('/cars/create', car_controller.car_create_get);
router.post('/cars/create', car_controller.car_create_post);
router.get('/cars/:id/delete', car_controller.car_delete_get);
router.post('/cars/:id/delete', car_controller.car_delete_post);
router.get('/cars/:id/update', car_controller.car_update_get);
router.post('/cars/:id/update', car_controller.car_update_post);



module.exports = router;
