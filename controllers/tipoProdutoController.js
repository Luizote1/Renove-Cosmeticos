const TipoProdutoModel = require("../models/tipoProdutoModel");

class TipoProdutoController {
    async listar(req, res) {
        let model = new TipoProdutoModel();
        let lista = await model.listar();

        res.render("tipoProduto/lista", {
            layout: "layout",
            lista: lista
        });
    }

    cadastrarView(req, res) {
        res.render("tipoProduto/cadastrar", {
            layout: "layout"
        });
    }

    async cadastrar(req, res) {
        let ok = false;
        let msg = "";

        if (req.body.descricao && req.body.descricao.trim() !== "") {
            let model = new TipoProdutoModel(
                0,
                req.body.descricao,
                req.body.ativo ? "s" : "n"
            );

            let result = await model.cadastrar();

            if (result) {
                ok = true;
                msg = "Tipo de produto cadastrado com sucesso!";
            } else {
                msg = "Erro ao cadastrar tipo de produto.";
            }
        } else {
            msg = "Informe a descrição.";
        }

        res.send({ ok, msg });
    }

    async alterarView(req, res) {
        let model = new TipoProdutoModel();
        let tipo = await model.obter(req.params.id);

        res.render("tipoProduto/alterar", {
            layout: "layout",
            tipo: tipo
        });
    }

    async alterar(req, res) {
        let ok = false;
        let msg = "";

        if (req.body.id && req.body.descricao && req.body.descricao.trim() !== "") {
            let model = new TipoProdutoModel(
                req.body.id,
                req.body.descricao,
                req.body.ativo ? "s" : "n"
            );

            let result = await model.atualizar();

            if (result) {
                ok = true;
                msg = "Tipo de produto alterado com sucesso!";
            } else {
                msg = "Erro ao alterar tipo de produto.";
            }
        } else {
            msg = "Dados inválidos para alteração.";
        }

        res.send({ ok, msg });
    }

    async excluir(req, res) {
        let ok = false;
        let msg = "";

        try {
            if (req.body.id) {
                let model = new TipoProdutoModel();
                let result = await model.deletar(req.body.id);

                if (result) {
                    ok = true;
                    msg = "Tipo de produto excluído com sucesso!";
                } else {
                    msg = "Erro ao excluir tipo de produto.";
                }
            } else {
                msg = "ID não informado.";
            }
        } catch (erro) {
            console.error(erro);
            msg = "Erro interno ao excluir tipo de produto.";
        }

        res.send({ ok, msg });
    }
}

module.exports = TipoProdutoController;