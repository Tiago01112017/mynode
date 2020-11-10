const express = require("express")
const app     = express()

const morgan     = require("morgan")// verifica tudo
const bodyParser = require("body-parser")
const path       = require('path');

const routaProdutos = require("./routers/produtos")
const routaPedidos = require("./routers/pedidos")
const routaUsuarios = require("./routers/usuario")

// configurações
app.use("/", express.static('uploads'))
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//controla as permições
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if(req.method == "OPTIONS"){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELET, PATCH, GET')
        return res.status(200).send({})
    }
    next()
})

 app.use("/produtos", routaProdutos)
 app.use("/pedidos", routaPedidos)
 app.use("/usuarios", routaUsuarios)

 //tratamento de erro
 app.use((req, res, next)=>{
     const erro = new Error("Não encontrado");
     erro.status= 404;
     next(erro)
 })

 app.use((error, req, res, next)=>{
     res.status(error.status || 500)
     return res.send({
         erro:{
             mensagem: error.message
         }
     })
 })

 module.exports = app