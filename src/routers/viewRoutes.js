const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewsController.getTithes);

router.get('/login', viewsController.loginPage);

router.get('/tithes', viewsController.getTithes);

router.get('/tithes/:id', viewsController.readTithes);

router.get('/admin', viewsController.adminPage);

router.get(
  '/editTithes',
  authController.protect,
  viewsController.modifyTithesPage
);
router.get(
  '/editTithes/:id',
  authController.protect,
  viewsController.modifyTithes
);

module.exports = router;
