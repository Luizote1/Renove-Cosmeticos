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
            let busca = req.query.busca || "";

            let model = new DevolucaoModel();

            let pedidos = await model.listarPedidos(busca);

            res.render("devolucao/cadastrar", {
                layout: "layout",
                pedidos: pedidos,
                busca: busca
            });

        } catch (erro) {
            console.log("ERRO AO ABRIR CADASTRO DE DEVOLUÇÃO:", erro);

            res.render("devolucao/cadastrar", {
                layout: "layout",
                pedidos: [],
                busca: ""
            });
        }
    }

    async cadastrar(req, res) {
        try {
            if (
                !req.body.pedido ||
                !req.body.motivo
            ) {
                return res.send({
                    ok: false,
                    msg: "Preencha todos os campos obrigatórios."
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

            if (pedido.ped_status == "Devolvido") {
                return res.send({
                    ok: false,
                    msg: "Este pedido já foi devolvido."
                });
            }

            let itens = await modelBusca.listarItensPedido(req.body.pedido);

            if (itens.length == 0) {
                return res.send({
                    ok: false,
                    msg: "Este pedido não possui produtos para devolução."
                });
            }

            for (let i = 0; i < itens.length; i++) {

                let devolucao = new DevolucaoModel(
                    0,
                    req.body.pedido,
                    pedido.cli_id,
                    itens[i].pro_codigo,
                    itens[i].pit_quantidade,
                    req.body.motivo,
                    new Date(),
                    req.body.observacao || ""
                );

                await devolucao.cadastrar();
                await devolucao.devolverEstoque();
            }

            await modelBusca.atualizarStatusPedido(
                req.body.pedido,
                "Devolvido"
            );

            return res.send({
                ok: true,
                msg: "Pedido devolvido com sucesso! Todos os produtos voltaram ao estoque."
            });

        } catch (erro) {
            console.log("ERRO AO CADASTRAR DEVOLUÇÃO:", erro);

            return res.send({
                ok: false,
                msg: "Erro interno ao registrar devolução."
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