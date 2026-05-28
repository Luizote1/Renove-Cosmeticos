const TipoProdutoModel = require("../models/tipoProdutoModel");

class TipoProdutoController {

    async listar(req, res) {

        try {

            let model = new TipoProdutoModel();
            let lista = await model.listar();

            res.render("tipoProduto/lista", {
                layout: "layout",
                lista: lista
            });

        }
        catch (erro) {

            console.log("ERRO AO LISTAR TIPOS:", erro);

            res.render("tipoProduto/lista", {
                layout: "layout",
                lista: []
            });
        }
    }

    cadastrarView(req, res) {

        res.render("tipoProduto/cadastrar", {
            layout: "layout"
        });
    }

    async cadastrar(req, res) {

        try {

            let ok = false;
            let msg = "";

            if (
                req.body.descricao &&
                req.body.descricao.trim() !== ""
            ) {

                let model = new TipoProdutoModel(
                    0,
                    req.body.descricao.trim(),
                    req.body.ativo ? "s" : "n"
                );

                let result = await model.cadastrar();

                if (result) {

                    ok = true;
                    msg = "Tipo de produto cadastrado com sucesso!";

                } else {

                    msg = "Não foi possível cadastrar o tipo de produto.";
                }

            } else {

                msg = "Informe a descrição do tipo de produto.";
            }

            res.send({ ok, msg });

        }
        catch (erro) {

            console.log("ERRO AO CADASTRAR TIPO:", erro);

            res.send({
                ok: false,
                msg: "Erro interno ao cadastrar tipo de produto."
            });
        }
    }

    async alterarView(req, res) {

        try {

            let model = new TipoProdutoModel();
            let tipo = await model.obter(req.params.id);

            if (!tipo) {
                return res.redirect("/tipoproduto");
            }

            res.render("tipoProduto/alterar", {
                layout: "layout",
                tipo: tipo
            });

        }
        catch (erro) {

            console.log("ERRO AO ABRIR ALTERAÇÃO:", erro);

            res.redirect("/tipoproduto");
        }
    }

    async alterar(req, res) {

        try {

            let ok = false;
            let msg = "";

            if (
                req.body.id &&
                req.body.descricao &&
                req.body.descricao.trim() !== ""
            ) {

                let model = new TipoProdutoModel(
                    req.body.id,
                    req.body.descricao.trim(),
                    req.body.ativo ? "s" : "n"
                );

                let result = await model.atualizar();

                if (result) {

                    ok = true;
                    msg = "Tipo de produto alterado com sucesso!";

                } else {

                    msg = "Não foi possível alterar o tipo de produto.";
                }

            } else {

                msg = "Preencha corretamente os campos obrigatórios.";
            }

            res.send({ ok, msg });

        }
        catch (erro) {

            console.log("ERRO AO ALTERAR TIPO:", erro);

            res.send({
                ok: false,
                msg: "Erro interno ao alterar tipo de produto."
            });
        }
    }

    async excluir(req, res) {

        try {

            if (!req.body.id) {

                return res.send({
                    ok: false,
                    msg: "ID do tipo de produto não informado."
                });
            }

            let model = new TipoProdutoModel();

            let result = await model.deletar(req.body.id);

            if (result) {

                return res.send({
                    ok: true,
                    msg: "Tipo de produto excluído com sucesso!"
                });
            }

            return res.send({
                ok: false,
                msg: "Não é possível excluir este tipo de produto porque existem produtos vinculados."
            });

        }
        catch (erro) {

            console.log("ERRO AO EXCLUIR TIPO:", erro);

            return res.send({
                ok: false,
                msg: "Não é possível excluir este tipo de produto porque existem registros relacionados."
            });
        }
    }
}

module.exports = TipoProdutoController;