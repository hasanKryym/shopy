const express = require('express');
const router = express.Router();

const { login, register } = require('../controllers/auth');
const authenticate = require('../middleware/authentication');

router.post('/register', register);
router.post('/login', login);
router.get('/', authenticate, async (req, res) => {
  const user_id = req.user;
  if (user_id) return res.status(200).send(true);

  res.send(false);
});

module.exports = router;
