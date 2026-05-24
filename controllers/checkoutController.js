const PedidoModel = require("../models/pedidoModel");

class CheckoutController {

    async checkout(req, res) {

        res.render("checkout/checkout", {
            layout: false,
            usuarioLogado: req.usuarioLogado || null,
            tipoLogado: req.tipoLogado || null
        });

    }

    async finalizarCompra(req, res) {

        try {

            if (!req.usuarioLogado) {
                return res.status(401).json({
                    ok: false,
                    msg: "Usuário não autenticado."
                });
            }

            if (req.tipoLogado !== "cliente") {
                return res.status(403).json({
                    ok: false,
                    msg: "Apenas clientes podem comprar."
                });
            }

            const cli_id = req.usuarioLogado.cliId;

            const { endereco, carrinho, pagamento } = req.body;

            if (!cli_id) {
                return res.status(400).json({
                    ok: false,
                    msg: "Cliente inválido."
                });
            }

            if (!carrinho || carrinho.length === 0) {
                return res.status(400).json({
                    ok: false,
                    msg: "Carrinho vazio."
                });
            }

            const pedidoModel = new PedidoModel();

            // VALIDAR ESTOQUE PRIMEIRO
            for (let item of carrinho) {

                console.log(
                    "ITEM:",
                    item.id,
                    item.name,
                    item.quantity
                );

                const estoqueOK =
                    await pedidoModel.verificarEstoque(
                        item.id,
                        item.quantity
                    );

                if (!estoqueOK) {

                    return res.status(400).json({
                        ok: false,
                        msg: `Estoque insuficiente para: ${item.name}`
                    });
                }
            }

            // GRAVAR ENDEREÇO
            const end_id =
                await pedidoModel.gravarEndereco(
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

                valorTotal +=
                    Number(item.price) *
                    Number(item.quantity);
            }

            // GRAVAR PEDIDO
            const ped_id =
                await pedidoModel.gravarPedido(
                    cli_id,
                    end_id,
                    valorTotal,
                    pagamento || "PIX"
                );

            // GRAVAR ITENS + DIMINUIR ESTOQUE
            for (let item of carrinho) {

                await pedidoModel.gravarItemPedido(
                    ped_id,
                    item.id,
                    item.quantity,
                    item.price
                );

                await pedidoModel.diminuirEstoque(
                    item.id,
                    item.quantity
                );
            }

            return res.json({
                ok: true,
                msg: "Pedido realizado com sucesso!"
            });

        }
        catch (erro) {

            console.log(
                "ERRO AO FINALIZAR COMPRA:",
                erro
            );

            return res.status(500).json({
                ok: false,
                msg: "Erro interno ao finalizar compra."
            });
        }
    }
}

module.exports = CheckoutController;