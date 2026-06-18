    const DevolucaoModel = require("../models/devolucaoModel");

    class DevolucaoController {

        async listar(req, res) {
            try {
                let model = new DevolucaoModel();

                let lista = await model.listar();

                res.render("devolucao/lista", {
                    layout: "layout",
                    lista: lista
                });

            } catch (erro) {
                console.log("ERRO AO LISTAR DEVOLUÇÕES:", erro);

                res.render("devolucao/lista", {
                    layout: "layout",
                    lista: []
                });
            }
        }

        async cadastrarView(req, res) {
            try {
                let model = new DevolucaoModel();

                let pedidos = await model.listarPedidos();

                res.render("devolucao/cadastrar", {
                    layout: "layout",
                    pedidos: pedidos
                });

            } catch (erro) {
                console.log("ERRO AO ABRIR CADASTRO DE DEVOLUÇÃO:", erro);
                res.redirect("/devolucao");
            }
        }

        async cadastrar(req, res) {
            try {
                if (
                    !req.body.pedido ||
                    !req.body.produto ||
                    !req.body.quantidade ||
                    !req.body.motivo
                ) {
                    return res.send({
                        ok: false,
                        msg: "Preencha todos os campos obrigatórios."
                    });
                }

                let quantidade = Number(req.body.quantidade);

                if (!Number.isInteger(quantidade) || quantidade <= 0) {
                    return res.send({
                        ok: false,
                        msg: "A quantidade deve ser um número inteiro maior que zero."
                    });
                }

                let modelBusca = new DevolucaoModel();

                let pedido = await modelBusca.obterPedido(req.body.pedido);

                if (!pedido) {
                    return res.send({
                        ok: false,
                        msg: "Pedido não encontrado."
                    });
                }

                let itens = await modelBusca.listarItensPedido(req.body.pedido);

                let itemPedido = null;

                for (let i = 0; i < itens.length; i++) {
                    if (itens[i].pro_codigo == req.body.produto) {
                        itemPedido = itens[i];
                        break;
                    }
                }

                if (!itemPedido) {
                    return res.send({
                        ok: false,
                        msg: "Produto não encontrado neste pedido."
                    });
                }

                let quantidadeVendida =
                    Number(itemPedido.pit_quantidade || itemPedido.quantidade || 0);

                if (quantidade > quantidadeVendida) {
                    return res.send({
                        ok: false,
                        msg: "A quantidade devolvida não pode ser maior que a quantidade comprada."
                    });
                }

                let dataAtual = new Date();

                let devolucao = new DevolucaoModel(
                    0,
                    req.body.pedido,
                    pedido.cli_id,
                    req.body.produto,
                    quantidade,
                    req.body.motivo,
                    dataAtual,
                    req.body.observacao || ""
                );

                let result = await devolucao.cadastrar();

                if (result) {
                    await devolucao.devolverEstoque();

                    await devolucao.atualizarStatusPedido(
                        req.body.pedido,
                        "Devolução registrada"
                    );

                    return res.send({
                        ok: true,
                        msg: "Devolução registrada com sucesso! O estoque foi atualizado."
                    });
                }

                return res.send({
                    ok: false,
                    msg: "Não foi possível registrar a devolução."
                });

            } catch (erro) {
                console.log("ERRO AO CADASTRAR DEVOLUÇÃO:", erro);

                return res.send({
                    ok: false,
                    msg: "Erro interno ao registrar devolução."
                });
            }
        }

        async buscarItensPedido(req, res) {
            try {
                if (!req.params.id) {
                    return res.send({
                        ok: false,
                        itens: [],
                        msg: "Pedido não informado."
                    });
                }

                let model = new DevolucaoModel();

                let itens = await model.listarItensPedido(req.params.id);

                return res.send({
                    ok: true,
                    itens: itens
                });

            } catch (erro) {
                console.log("ERRO AO BUSCAR ITENS DO PEDIDO:", erro);

                return res.send({
                    ok: false,
                    itens: [],
                    msg: "Erro ao buscar itens do pedido."
                });
            }
        }

        async deletar(req, res) {
            return res.send({
                ok: false,
                msg: "Não é possível excluir uma devolução, pois ela faz parte do histórico de entrada de estoque."
            });
        }
    }

    module.exports = DevolucaoController;