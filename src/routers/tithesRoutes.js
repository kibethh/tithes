const express = require('express');
const authController = require('../controllers/authController');
const tithesController = require('../controllers/tithesController');

const router = new express.Router();

router.post('/', authController.protect, tithesController.createTither);
// router.post('/', sermonController.createSermon);

router.get('/', tithesController.getTithes);
// router.get('/:id', authController.protect, tithesController.searchSermon);
router.get('/:id', tithesController.searchTithe);
router.patch('/:id', authController.protect, tithesController.updateTithe);
router.delete('/:id', authController.protect, tithesController.removeTithe);
module.exports = router;
