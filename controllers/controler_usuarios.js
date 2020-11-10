const {pool}  = require('../bancodedados/mys');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.cadastro = (req, res, next)=>{
    pool.getConnection((error, conn)=>{
        if(error){return res.status(500).send({mensagem: error})}
        conn.query('Select * from usuarios where email = ?', [req.body.email],(error, resul)=>{
            if(error){return res.status(500).send({mensagem: error})}
            if(resul.length >0){
                res.status(409).send({mensagem:"Email ja cadastrado"})
            }else{
                bcrypt.hash(req.body.senha, 10, (errbcrypt, hash)=>{
                    if(errbcrypt){return res.status(500).send({mensagem: errbcrypt})}
                    conn.query(
                        "insert into usuarios (email, senha) values (?,?)",
                        [req.body.email,hash],
                        (error, result)=>{
                            conn.release()
                            if(error){return res.status(500).send({mensagem: error})}
                            const response = {
                                mensagem: "Usuario criado com sucesso",
                                usuarioCriado:{
                                    idusuario: result.insertId,
                                    email: req.body.email
                                }
                            }
                            return res.status(201).send(response)
                        }
                    )
                })
            }
        })
        
    })
};

exports.login = (req, res, next)=>{
    pool.getConnection((error, conn)=>{
        if(error){return res.status(500).send({mensagem: error})}
        const query = "select * from usuarios where email = ?";
        conn.query(query, [req.body.email],(error, resul)=>{
            conn.release()
            if(error){return res.status(500).send({mensagem: error})}
            if(resul.length < 1){
                return res.status(401).send({mensagem: "Erro na autenticação"})
            }
            bcrypt.compare(req.body.senha, resul[0].senha, (err,result)=>{
                if(err){return res.status(401).send({mensagem: "Erro na autenticação"})}
                if(result){
                    const token = jwt.sign(
                        {
                            idusuario: resul[0].idusuario,
                            email: resul[0].email
                        },
                            process.env.JWP_KEY,
                        {
                            expiresIn:"1h"
                        }
                    )
                    return res.status(200).send(
                        {
                            mensagem: "Autenticação bem sucessidade",
                            token: token
                         }
                    )
                }
                return res.status(401).send({mensagem: "Erro na autenticação"})
            })
        })
    })
}