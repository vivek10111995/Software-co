const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getUsers);
router.put('/update-many', userController.updateManyUsers);
router.put('/update-individual', userController.updateUsersIndividually);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/check-access', userController.checkUserAccess);

module.exports = router;
