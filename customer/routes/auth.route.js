const express = require('express');
const { signup, login, logout, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/signup', signup)
.get('/allusers', getAllUsers);

router
  .route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);
  
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;