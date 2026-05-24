const DescarteModel = require("../models/descarteModel");
const ProdutoModel = require("../models/produtoModel");

class DescarteController {

    async listar(req, res) {
        let model = new DescarteModel();
        let lista = await model.listar();

        res.render("descarte/lista", {
            layout: "layout",
            lista: lista
        });
    }

    async cadastrarView(req, res) {
        let produtoModel = new ProdutoModel();
        let produtos = await produtoModel.listar();

        res.render("descarte/cadastrar", {
            layout: "layout",
            produtos: produtos
        });
    }

    async cadastrar(req, res) {
        let ok = false;
        let msg = "";

        if (
            req.body.produto &&
            req.body.quantidade &&
            req.body.data &&
            req.body.motivo
        ) {
            let model = new DescarteModel(
                0,
                req.body.produto,
                req.body.quantidade,
                req.body.data,
                req.body.motivo,
                req.body.observacao
            );

            let baixou = await model.baixarEstoque();

            if (baixou) {
                ok = await model.cadastrar();

                if (ok) {
                    msg = "Descarte registrado e estoque baixado!";
                } else {
                    msg = "Erro ao registrar descarte.";
                }

            } else {
                msg = "Estoque insuficiente para descarte.";
            }

        } else {
            msg = "Preencha os campos obrigatórios.";
        }

        res.send({ ok, msg });
    }

    async alterarView(req, res) {
        let model = new DescarteModel();
        let descarte = await model.obter(req.params.id);

        let produtoModel = new ProdutoModel();
        let produtos = await produtoModel.listar();

        res.render("descarte/alterar", {
            layout: "layout",
            descarte: descarte,
            produtos: produtos
        });
    }

    async alterar(req, res) {
        let ok = false;
        let msg = "";

        if (
            req.body.id &&
            req.body.produto &&
            req.body.quantidade &&
            req.body.data &&
            req.body.motivo
        ) {
            let model = new DescarteModel(
                req.body.id,
                req.body.produto,
                req.body.quantidade,
                req.body.data,
                req.body.motivo,
                req.body.observacao
            );

            ok = await model.atualizar();

            if (ok) {
                msg = "Descarte alterado!";
            } else {
                msg = "Erro ao alterar descarte.";
            }

        } else {
            msg = "Preencha os campos obrigatórios.";
        }

        res.send({ ok, msg });
    }

    async deletar(req, res) {
        let model = new DescarteModel();
        let ok = await model.deletar(req.body.id);

        res.send({
            ok: ok,
            msg: ok ? "Descarte excluído!" : "Erro ao excluir descarte."
        });
    }
}

module.exports = DescarteController;