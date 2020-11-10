const express = require('express')
const router  = express.Router();
const controller = require('../controllers/controler_usuarios')

router.post("/cadastro", controller.cadastro);
router.post("/login", controller.login );

module.exports = router