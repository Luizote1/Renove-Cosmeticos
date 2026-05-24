const PedidoModel = require("../models/pedidoModel");

class PedidoController {

    async pedidosView(req, res) {
        res.render("pedido/index", {
            layout: "layout"
        });
    }

    async listarPedidos(req, res) {
        try {
            let busca = req.query.busca || "";

            let pedido = new PedidoModel();
            let lista = await pedido.listar(busca);

            return res.json(lista);

        } catch (erro) {
            console.log("ERRO AO LISTAR PEDIDOS:", erro);
            return res.status(500).json([]);
        }
    }

    async meusPedidosView(req, res) {
        res.render("pedido/meus-pedidos", {
            layout: false,
            usuarioLogado: req.cookies && req.cookies.usuarioLogado,
            tipoLogado: req.cookies && req.cookies.tipoLogado
        });
    }

    async listarMeusPedidos(req, res) {
        try {
            let cliId = req.cookies.usuarioLogado;

            if (!cliId) {
                return res.json([]);
            }

            let pedido = new PedidoModel();
            let lista = await pedido.listarPedidosCliente(cliId);

            return res.json(lista);

        } catch (erro) {
            console.log("ERRO AO LISTAR MEUS PEDIDOS:", erro);
            return res.status(500).json([]);
        }
    }

    async imprimirPedido(req, res) {
        try {
            let id = req.params.id;

            let pedidoModel = new PedidoModel();
            let pedido = await pedidoModel.buscarPedido(id);

            if (!pedido || pedido.length === 0) {
                return res.send("Pedido não encontrado.");
            }

            res.render("pedido/imprimir", {
                layout: false,
                pedido: pedido
            });

        } catch (erro) {
            console.log("ERRO AO IMPRIMIR PEDIDO:", erro);
            res.status(500).send("Erro ao imprimir pedido.");
        }
    }

    async gravar(req, res) {
        try {
            let cli_id = req.cookies.usuarioLogado;

            if (!cli_id) {
                return res.json({
                    ok: false,
                    msg: "Você precisa estar logado para finalizar a compra."
                });
            }

            let { carrinho, endereco, pagamento } = req.body;

            if (!carrinho || carrinho.length === 0) {
                return res.json({
                    ok: false,
                    msg: "Carrinho vazio."
                });
            }

            if (!endereco) {
                return res.json({
                    ok: false,
                    msg: "Endereço não informado."
                });
            }

            let pedido = new PedidoModel();

            for (let item of carrinho) {
                let estoqueOK = await pedido.verificarEstoque(item.id, item.quantity);

                if (!estoqueOK) {
                    return res.json({
                        ok: false,
                        msg: "Estoque insuficiente para: " + item.name
                    });
                }
            }

            let end_id = await pedido.gravarEndereco(
                cli_id,
                endereco.cep,
                endereco.rua,
                endereco.numero,
                endereco.bairro,
                endereco.cidade,
                endereco.estado,
                endereco.complemento || ""
            );

            let valorTotal = 0;

            for (let item of carrinho) {
                valorTotal += Number(item.price) * Number(item.quantity);
            }

            let ped_id = await pedido.gravarPedido(
                cli_id,
                end_id,
                valorTotal,
                pagamento || "Não informado"
            );

            for (let item of carrinho) {
                await pedido.gravarItemPedido(
                    ped_id,
                    item.id,
                    item.quantity,
                    item.price
                );

                await pedido.diminuirEstoque(
                    item.id,
                    item.quantity
                );
            }

            return res.json({
                ok: true,
                msg: "Pedido gerado com sucesso!"
            });

        } catch (erro) {
            console.log("ERRO AO GRAVAR PEDIDO:", erro);

            return res.status(500).json({
                ok: false,
                msg: "Erro ao finalizar pedido."
            });
        }
    }
}

module.exports = PedidoController;