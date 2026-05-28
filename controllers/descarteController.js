const DescarteModel = require("../models/descarteModel");
const ProdutoModel = require("../models/produtoModel");

class DescarteController {

    async listar(req, res) {
        try {
            let model = new DescarteModel();
            let lista = await model.listar();

            res.render("descarte/lista", {
                layout: "layout",
                lista: lista
            });

        } catch (erro) {
            console.log("ERRO AO LISTAR DESCARTES:", erro);

            res.render("descarte/lista", {
                layout: "layout",
                lista: []
            });
        }
    }

    async cadastrarView(req, res) {
        try {
            let produtoModel = new ProdutoModel();
            let produtos = await produtoModel.listar();

            res.render("descarte/cadastrar", {
                layout: "layout",
                produtos: produtos
            });

        } catch (erro) {
            console.log("ERRO AO ABRIR CADASTRO DE DESCARTE:", erro);
            res.redirect("/descarte");
        }
    }

    async cadastrar(req, res) {
        try {
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

                if (baixou && baixou.affectedRows > 0) {
                    let result = await model.cadastrar();

                    if (result) {
                        ok = true;
                        msg = "Descarte registrado com sucesso! O estoque foi baixado.";
                    } else {
                        msg = "Não foi possível registrar o descarte.";
                    }

                } else {
                    msg = "Estoque insuficiente para realizar este descarte.";
                }

            } else {
                msg = "Preencha todos os campos obrigatórios.";
            }

            res.send({ ok, msg });

        } catch (erro) {
            console.log("ERRO AO CADASTRAR DESCARTE:", erro);

            res.send({
                ok: false,
                msg: "Erro interno ao registrar descarte."
            });
        }
    }

    async alterarView(req, res) {
        try {
            let model = new DescarteModel();
            let descarte = await model.obter(req.params.id);

            let produtoModel = new ProdutoModel();
            let produtos = await produtoModel.listar();

            if (!descarte) {
                return res.redirect("/descarte");
            }

            res.render("descarte/alterar", {
                layout: "layout",
                descarte: descarte,
                produtos: produtos
            });

        } catch (erro) {
            console.log("ERRO AO ABRIR ALTERAÇÃO DE DESCARTE:", erro);
            res.redirect("/descarte");
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

                let result = await model.atualizar();

                if (result) {
                    ok = true;
                    msg = "Descarte alterado com sucesso!";
                } else {
                    msg = "Não foi possível alterar o descarte.";
                }

            } else {
                msg = "Preencha todos os campos obrigatórios.";
            }

            res.send({ ok, msg });

        } catch (erro) {
            console.log("ERRO AO ALTERAR DESCARTE:", erro);

            res.send({
                ok: false,
                msg: "Erro interno ao alterar descarte."
            });
        }
    }

    async deletar(req, res) {
        return res.send({
            ok: false,
            msg: "Não é possível excluir um descarte, pois ele faz parte do histórico de saída de estoque."
        });
    }
}

module.exports = DescarteController;