
const express = require("express");
const routers = express.Router();
const controller = require('../controllers/controler_pedidos')

routers.get("/", controller.getPedidos );
routers.post("/", controller.postPedidos );
routers.get("/:id", controller.dados );
routers.delete("/:id", controller.delete );
routers.patch("/:id", controller.update );

module.exports = routers