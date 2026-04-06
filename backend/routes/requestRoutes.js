const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

// Request to join a ride
router.post('/', requestController.createRequest);

// Get pending requests for a driver's rides
router.get('/:driverId', requestController.getPendingRequests);

// Accept or reject a request
router.put('/:requestId', requestController.updateRequestStatus);

module.exports = router;
