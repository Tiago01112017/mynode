const {pool} = require('../bancodedados/mys')

exports.getPedidos = async (req, res, next)=>{
    pool.getConnection((error, coon)=>{
        if(error){ return res.status(500).send({mensagem: error})}
        coon.query(
        ` select pedido.idpedido,
                    pedido.quantidade,
                    produtos.idprodutos,
                    produtos.nome,
                    produtos.preco
            from pedido
            left join produtos
                on (produtos.idprodutos = pedido.id_produtos);
        `,
            (error, result, fields)=>{
                if(error){return res.status(500).send({mensagem: error, produtos: null})}
                const response = {
                    pedidos: result.map(pedi=>{
                        return {
                            idpedido:  pedi.idpedido,
                            quantidade: pedi.quantidade,
                            produto:{
                                idproduto: pedi.idprodutos,
                                nome: pedi.nome,
                                preco: pedi.preco
                            },
                            request:{
                                url: "http://localhost:3000/pedidos/" + pedi.idpedido
                            }
                        }
                    })
                }
                return  res.status(200).send(response)
            }
        )
    })
    
    
};


exports.postPedidos =  (req, res, next)=>{
    pool.getConnection((error, coon)=>{
        if(error){return res.status(500).send({mensagem:error})}
        coon.query(
            "Select * from produtos where idprodutos = ?",
            [req.body.idproduto],
            (error, resul, fields)=>{
                if(error){return res.status(500).send({mensagem: error})}
                if(resul.length == 0){
                    return res.status(404).send({
                        mensagem: "Produto não encontrado"
                    })
                }
            }
        )
        coon.query(
            "insert into pedido (id_produtos, quantidade) values(?,?)",
            [req.body.idproduto, req.body.quantidade],
            (error, result,fields)=>{
                coon.release()
                if(error){return res.status(500).send({mensagem: error})}
                const response = {
                    mensagem: "Pedido inserido com sucesso",
                    idpedido: result.idpedido,
                    idproduto: req.body.idproduto,
                    quantidade: req.body.quantidade,
                    request:{
                        url:"http://localhost:3000/pedidos"
                    }

                }
                return res.status(201).send(response)
            }
        )
    })
};

exports.dados = (req, res, next)=>{
    pool.getConnection((error, conn)=>{
        if(error){return res.status(500).send({mensagem: error})}
        conn.query(
            'select * from pedido where idpedido = ?',
            [req.params.id],
            (error, resul, fields)=>{
                if(error){return res.status(500).send({mensagem: error})}

                if(resul.length == 0){return res.status(404).send({mensagem:"registro não encontrado"})}
                const response = {
                    idpedido: resul[0].idpedido,
                    id_produtos: resul[0].id_produtos,
                    quantidade: resul[0].quantidade,
                    request:{
                        query: "GET"
                    }
                }

                return res.status(200).send(response)
            }
        )
    })

};

exports.delete = (req, res, next)=>{
    pool.getConnection((error, conn)=>{
        if(error){return res.status(500).send({mensagem: error})}
        conn.query(
            "delete from pedido where idpedido=?", [req.params.id],
            (error, resul, fields)=>{
                conn.release()
                if(error){return res.status(500).send({mensagem: error})}

                const response={
                    mensagem: "Produto com id "+req.params.id+" foi deletado",
                    request:{
                        method: "POST",
                        url:  "http://localhost/3000/pedidos",
                        body:{
                            idproduto: "Number",
                            quantidade: "Number"
                        }
                    }
                }

                return res.status(202).send(response)
            }
        )
    })
};

exports.update = (req, res, next)=>{
    pool.getConnection((error, coon)=>{
        if(error){return res.status(500).send({mensagem: error})}
        coon.query(
            `update pedido
                set id_produtos = ?,
                     quantidade = ?
                where idpedido  = ?
            `,
            [
                req.body.idproduto,
                req.body.quantidade,
                req.params.id
            ],
            (error, resul, fields)=>{
                if(error){return res.status(500).send({mensagem:error, pedido: null})}
                 const response = {
                     mensagem:"pedido alterado com sucesso",
                     id_produtos: req.body.idproduto,
                     quantidade: req.body.quantidade,
                     request:{
                         query: "GET DETALHES",
                         url: "http://localhost:3000/pedidos/"+req.params.id
                     }
                 }
                 return res.status(202).send(response)
            }
        )
    })
};