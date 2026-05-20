const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const auth = require('../controllers/Auth.controller');

router.post('/login',  auth.login);
router.post('/logout', auth.logout);
router.get ('/me',     protect, auth.getMe);
router.get("/test", (req, res) => {
    res.json({
        message: "Auth route working"
    });
});
module.exports = router;