const express = require("express")
const routers = express.Router()
const multer = require('multer')
const login = require('../middleware/login');
const controller = require('../controllers/controler_produtos')

const storega = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './uploads/');
    },

    filename: (req, file, cb)=>{
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname )
    }
});

const fileFilter = (req, file, cb)=>{
    if(file.mimetype == "image/jpeg" || file.mimetype == "image/png"){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

const upload = multer({
    storage: storega,
    limits: {
        fileSize: 1024 * 1024 * 5
    },

    fileFilter: fileFilter
})


routers.get("/", controller.getProdutos );
routers.post("/",
    login.obrigatorio,
    upload.single('protudo_img'),
    controller.postProduto
)
routers.get("/:idprodutos", controller.dados)
routers.patch("/:id", login.obrigatorio, controller.updateProdutos)
routers.delete("/",login.obrigatorio, controller.deleteProduto)

routers.post("/:id/imagem",
    login.obrigatorio,
    upload.single('protudo_img'),
    controller.postProduto
)

module.exports = routers