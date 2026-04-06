const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');

router.post('/create-ride', rideController.createRide);
router.get('/', rideController.getAllRides);
router.post('/join-ride', rideController.joinRide);
router.delete('/:id', rideController.deleteRide);
router.get('/user-rides/:uid', rideController.getUserRides);
router.post('/finish-ride', rideController.finishRide);

module.exports = router;
