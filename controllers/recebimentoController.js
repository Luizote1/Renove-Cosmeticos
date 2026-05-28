const RecebimentoModel = require("../models/recebimentoModel");
const ProdutoModel = require("../models/produtoModel");

class RecebimentoController {

    async listar(req, res) {
        try {
            let model = new RecebimentoModel();
            let lista = await model.listar();

            res.render("recebimento/lista", {
                layout: "layout",
                lista: lista
            });

        } catch (erro) {
            console.log("ERRO AO LISTAR RECEBIMENTOS:", erro);

            res.render("recebimento/lista", {
                layout: "layout",
                lista: []
            });
        }
    }

    async cadastrarView(req, res) {
        try {
            let produtoModel = new ProdutoModel();
            let produtos = await produtoModel.listar();

            res.render("recebimento/cadastrar", {
                layout: "layout",
                produtos: produtos
            });

        } catch (erro) {
            console.log("ERRO AO ABRIR CADASTRO DE RECEBIMENTO:", erro);
            res.redirect("/recebimento");
        }
    }

    async cadastrar(req, res) {
        try {
            let ok = false;
            let msg = "";

            if (
                req.body.produto &&
                req.body.quantidade &&
                req.body.data
            ) {
                let model = new RecebimentoModel(
                    0,
                    req.body.produto,
                    req.body.quantidade,
                    req.body.data,
                    req.body.lote,
                    req.body.validade,
                    req.body.observacao
                );

                let result = await model.cadastrar();

                if (result) {
                    await model.atualizarEstoque();

                    ok = true;
                    msg = "Recebimento cadastrado com sucesso! O estoque foi atualizado.";
                } else {
                    msg = "Não foi possível cadastrar o recebimento.";
                }

            } else {
                msg = "Preencha todos os campos obrigatórios.";
            }

            res.send({ ok, msg });

        } catch (erro) {
            console.log("ERRO AO CADASTRAR RECEBIMENTO:", erro);

            res.send({
                ok: false,
                msg: "Erro interno ao cadastrar recebimento."
            });
        }
    }

    async alterarView(req, res) {
        try {
            let model = new RecebimentoModel();
            let recebimento = await model.obter(req.params.id);

            let produtoModel = new ProdutoModel();
            let produtos = await produtoModel.listar();

            if (!recebimento) {
                return res.redirect("/recebimento");
            }

            res.render("recebimento/alterar", {
                layout: "layout",
                recebimento: recebimento,
                produtos: produtos
            });

        } catch (erro) {
            console.log("ERRO AO ABRIR ALTERAÇÃO DE RECEBIMENTO:", erro);
            res.redirect("/recebimento");
        }
    }

    async alterar(req, res) {
        try {
            let ok = false;
            let msg = "";

            if (
                req.body.id &&
                req.body.produto &&
                req.body.quantidade &&
                req.body.data
            ) {
                let model = new RecebimentoModel(
                    req.body.id,
                    req.body.produto,
                    req.body.quantidade,
                    req.body.data,
                    req.body.lote,
                    req.body.validade,
                    req.body.observacao
                );

                let result = await model.atualizar();

                if (result) {
                    ok = true;
                    msg = "Recebimento alterado com sucesso!";
                } else {
                    msg = "Não foi possível alterar o recebimento.";
                }

            } else {
                msg = "Preencha todos os campos obrigatórios.";
            }

            res.send({ ok, msg });

        } catch (erro) {
            console.log("ERRO AO ALTERAR RECEBIMENTO:", erro);

            res.send({
                ok: false,
                msg: "Erro interno ao alterar recebimento."
            });
        }
    }

    async deletar(req, res) {
        return res.send({
            ok: false,
            msg: "Não é possível excluir um recebimento, pois ele faz parte do histórico de entrada de estoque."
        });
    }
}

module.exports = RecebimentoController;