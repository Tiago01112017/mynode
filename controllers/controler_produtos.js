const { response } = require('../app');
const {pool,execute}  = require('../bancodedados/mys')

//========== esse metodo

exports.getProdutos = async(req, res, next)=>{
   try {
    const result = await execute('Select * from produtos');
    const response = {
            quantidade: result.length,
            produto: result.map(prod=>{
            return {
                idproduto: prod.idprodutos,
                imgProduto: prod.imgProduto,
                nome: prod.nome,
                preco: prod.preco,
                request:{
                    tipo: "get",
                    url: "http://localhost:3000/produtos/"+ prod.idprodutos
                }
            }
        })
    } 
    return res.status(200).send(response)
   } catch (error) {
       return res.status(500).send({error: error})
   }
}

//========== ou esse

// exports.getProdutos = (req, res, next)=>{
//     execute("select * from produtos").then((result)=>{
//         const response = {
//                 quantidade: result.length,
//                 produto: result.map(prod=>{
//                 return {
//                     idproduto: prod.idprodutos,
//                     imgProduto: prod.imgProduto,
//                     nome: prod.nome,
//                     preco: prod.preco,
//                     request:{
//                         tipo: "get",
//                         url: "http://localhost:3000/produtos/"+ prod.idprodutos
//                     }
//                 }

//             })
//         }
//         return res.status(200).send(response)
//     }).catch((error)=>{
//         return res.status(500).send( {error: error, produto: null} )
//     })
// }

//========== ou esse

// exports.getProdutos = (req, res, next)=>{
//     pool.getConnection((error, conn)=>{
//         if(error){return res.status(500).send( {error: error} )}
//         conn.query(
//             "select * from produtos",
//             (erro, resultado, fields)=>{
//                 if(erro){ return res.status(500).send( {error: error, produto: null} )}
//                 const response = {
//                     quantidade: resultado.length,
//                     produto: resultado.map(prod=>{
//                         return {
//                             idproduto: prod.idprodutos,
//                             imgProduto: prod.imgProduto,
//                             nome: prod.nome,
//                             preco: prod.preco,
//                             request:{
//                                 tipo: "get",
//                                 url: "http://localhost:3000/produtos/"+ prod.idprodutos
//                             }
//                         }

//                     })
//                 }
//                 return res.status(200).send(response)
//             }
//         )
//     })
// };

//========== Com parametros

exports.postProduto = async(req, res, next)=>{
    try {
        const query = "insert into produtos (nome, preco, imgProduto) values (?, ?, ?)";
        const result = await execute(query, 
            [
                req.body.nome, 
                req.body.preco,
                req.file.path
            ])
        const response = {
            mensagem: "Produto Inserido com Sucesso",
            idproduto:  result.idprodutos,
            imgProduto: result.imgProduto,
            nome:  req.body.nome,
            preco: req.body.preco,
            request:{
                url: "http://localhost:3000/produtos"
            }
        }
        return res.status(201).send(response)
    } catch (error) {
        return res.status(500).send({error: error, produto: null})
    }
}

// exports.postProduto = (req,res, next)=>{
//     console.log(req.file)
//     pool.getConnection((error, conn)=>{
//         if(error){return res.status(500).send( {error: error} )}
//         conn.query(
//             "insert into produtos (nome, preco, imgProduto) values (?, ?, ?)",
//             [
//                 req.body.nome, 
//                 req.body.preco,
//                 req.file.path
//             ],
//             (error, resultado, fields)=>{
//                 conn.release()
//                 if(error){return res.status(500).send({error: error, produto: null})}
//                 const response = {
//                     mensagem: "Produto Inserido com Sucesso",
//                     idproduto:  resultado.idprodutos,
//                     imgProduto: resultado.imgProduto,
//                     nome:  req.body.nome,
//                     preco: req.body.preco,
//                     request:{
//                         url: "http://localhost:3000/produtos"

//                     }

//                 }

//                 return res.status(201).send(response)
//             }
//         )
//     })

   
// };

exports.dados = (req, res, next)=>{
    pool.getConnection((error, conn)=>{
        if(error){return res.status(500).send({error: error})}
        conn.query(
            "select * from produtos where idprodutos = ?",
            [req.params.idprodutos],
            (error, result, fields)=>{
                if(error){return res.status(500).send({error: error, produto: null})}

                if(result.length == 0){
                    return res.status(404).send({mensagem: "Registro não encontrado"})
                }

                const response ={
                    idproduto: result[0].idprodutos,
                    imgProduto: result[0].imgProduto,
                    nome: result[0].nome,
                    preco: result[0].preco,
                    resquest:{
                        query: "GET"
                    }
                }
                return res.status(200).send(response)
            }
        )
    })
};

exports.updateProdutos = (req, res, next)=>{
    pool.getConnection((error, conn)=>{
        if(error){return res.status(500).send( {error: error} )}
        conn.query(
            `update produtos
                set    nome       = ?,
                       preco      = ?
                where  idprodutos = ? 
            `,
            [
                req.body.nome,
                req.body.preco,
                req.params.id
            ],
            (error, resultado, fields)=>{
                conn.release()
                if(error){return res.status(500).send({error: error, produto: null})}
                const response = {
                    mensagem: "Produto alterado",
                    idproduto:req.body.idprodutos,
                    nome: req.body.nome,
                    preco: req.body.preco,
                    request:{
                        url:"http://localhost:3000/produtos/"+ req.params.id
                    }
                }
                return res.status(202).send(response)
            }
        )
    })
};

exports.deleteProduto =  (req, res, next)=>{
    pool.getConnection((error, conn)=>{
        if(error){return res.status(500).send({error: error})}
        conn.query(
            "delete from produtos where idprodutos = ?", [req.body.idprodutos],
            (error, resultado, fields)=>{
                conn.release()
                if(error){return res.status(500).send( {error: error, produto: null} )}
                const response = {
                    mensagem: "Produto deletado com sucesso " + req.body.idprodutos,
                    request:{
                        method: "POST",
                        url:"http://localhost:3000/produtos",
                        body: {
                            nome:"STRING",
                            preco: "NUMBER"
                        }
                    }
                }
                res.status(202).send(response)
            }
        )
    })
};

exports.postImg = (req,res,next)=>{
    pool.getConnection((err, conn)=>{
        if(error){return res.status(500).send( {error: error} )}
        conn.query(
            'insert into img_produtos ()'
        )
    })
}