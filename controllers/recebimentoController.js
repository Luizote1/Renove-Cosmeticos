const RecebimentoModel = require("../models/recebimentoModel");
const ProdutoModel = require("../models/produtoModel");

class RecebimentoController {

    async listar(req, res) {
        let model = new RecebimentoModel();
        let lista = await model.listar();

        res.render("recebimento/lista", {
            layout: "layout",
            lista: lista
        });
    }

    async cadastrarView(req, res) {
        let produtoModel = new ProdutoModel();
        let produtos = await produtoModel.listar();

        res.render("recebimento/cadastrar", {
            layout: "layout",
            produtos: produtos
        });
    }

    async cadastrar(req, res) {
        let ok = false;
        let msg = "";

        if (req.body.produto && req.body.quantidade && req.body.data) {

            let model = new RecebimentoModel(
                0,
                req.body.produto,
                req.body.quantidade,
                req.body.data,
                req.body.lote,
                req.body.validade,
                req.body.observacao
            );

            ok = await model.cadastrar();

            if (ok) {
                await model.atualizarEstoque();
                msg = "Recebimento cadastrado e estoque atualizado!";
            } else {
                msg = "Erro ao cadastrar recebimento.";
            }

        } else {
            msg = "Preencha os campos obrigatórios.";
        }

        res.send({ ok, msg });
    }

    async alterarView(req, res) {
        let model = new RecebimentoModel();
        let recebimento = await model.obter(req.params.id);

        let produtoModel = new ProdutoModel();
        let produtos = await produtoModel.listar();

        res.render("recebimento/alterar", {
            layout: "layout",
            recebimento: recebimento,
            produtos: produtos
        });
    }

    async alterar(req, res) {
        let ok = false;
        let msg = "";

        if (req.body.id && req.body.produto && req.body.quantidade && req.body.data) {

            let model = new RecebimentoModel(
                req.body.id,
                req.body.produto,
                req.body.quantidade,
                req.body.data,
                req.body.lote,
                req.body.validade,
                req.body.observacao
            );

            ok = await model.atualizar();

            if (ok) {
                msg = "Recebimento alterado!";
            } else {
                msg = "Erro ao alterar recebimento.";
            }

        } else {
            msg = "Preencha os campos obrigatórios.";
        }

        res.send({ ok, msg });
    }

    async deletar(req, res) {
        let model = new RecebimentoModel();
        let ok = await model.deletar(req.body.id);

        res.send({
            ok: ok,
            msg: ok ? "Recebimento excluído!" : "Erro ao excluir recebimento."
        });
    }
}

module.exports = RecebimentoController;