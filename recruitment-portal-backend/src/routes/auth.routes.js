const express = require('express');

const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const { protect } = require('../middleware/auth');
const controller = require('../controllers/auth.controller');
const schema = require('../validators/auth.validator');

const router = express.Router();

// Public auth endpoints. The stricter authLimiter guards the sensitive ones.
router.post('/register', authLimiter, validate(schema.registerSchema), controller.register);
router.post('/verify-otp', authLimiter, validate(schema.verifyOtpSchema), controller.verifyOtp);
router.post('/login', authLimiter, validate(schema.loginSchema), controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
router.post('/forgot-password', authLimiter, validate(schema.forgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password', authLimiter, validate(schema.resetPasswordSchema), controller.resetPassword);

// Protected endpoints (valid access token required).
router.get('/me', protect, controller.me);
router.patch('/me', protect, validate(schema.updateProfileSchema), controller.updateMe);
router.delete('/account', protect, validate(schema.deleteAccountSchema), controller.deleteAccount);

module.exports = router;
