const express = require('express');
const router = express.Router();

// import controller
const {
  readController,
  updateController,
  updateOrders,
  getUserOrders,
} = require('../controllers/user.controller');

router.get('/user/:id', readController);
router.put('/user/update', updateController);
router.post('/user/createOrder/:id', updateOrders);
router.post('/user/orders/:_id', getUserOrders);

module.exports = router;
