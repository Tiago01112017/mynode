const jwt = require('jsonwebtoken')

exports.obrigatorio = (req,res,next)=>{
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, process.env.JWP_KEY)
        req.usuario = decode;
        next()
    } catch (error) {
        return res.status(401).send({mensagem: "Falaha na auteticação"})
    }
}

exports.opcional = (req, res, next)=>{
    try {
        const token = rea.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token. req.process.env.JWP_KEY)
        req.usuario = decode
        next()
    } catch (error) {
        next()
    }
}