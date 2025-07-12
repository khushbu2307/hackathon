
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// @route   GET /api/notifications
// @desc    Get notifications for user (auth required)
router.get('/', auth, notificationController.list);

// @route   PATCH /api/notifications/mark-read/:id
// @desc    Mark a notification as read (auth required)
router.patch('/mark-read/:id', auth, notificationController.markRead);

module.exports = router;
