const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');

router.post('/', roleController.createRole);
router.get('/', roleController.getRoles);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

module.exports = router;
