const PromocaoModel = require("../models/promocaoModel");
const ProdutoModel = require("../models/produtoModel");

class PromocaoController {

    async listar(req, res) {
        try {
            let model = new PromocaoModel();

            let lista = await model.listar();
            let proximosVencimento = await model.listarProdutosProximosVencimento();

            res.render("promocao/lista", {
                layout: "layout",
                lista: lista,
                proximosVencimento: proximosVencimento
            });

        } catch (erro) {
            console.log("ERRO AO LISTAR PROMOÇÕES:", erro);

            res.render("promocao/lista", {
                layout: "layout",
                lista: [],
                proximosVencimento: []
            });
        }
    }

    async cadastrarView(req, res) {
        try {
            let produtoModel = new ProdutoModel();
            let produtos = await produtoModel.listar();

            res.render("promocao/cadastrar", {
                layout: "layout",
                produtos: produtos
            });

        } catch (erro) {
            console.log("ERRO AO ABRIR CADASTRO DE PROMOÇÃO:", erro);
            res.redirect("/promocao");
        }
    }

    async cadastrar(req, res) {
        try {
            let ok = false;
            let msg = "";

            if (
                req.body.produto &&
                req.body.desconto &&
                req.body.dataInicio &&
                req.body.dataFim
            ) {
                let dataInicio = new Date(req.body.dataInicio);
                let dataFim = new Date(req.body.dataFim);

                if (Number(req.body.desconto) <= 0 || Number(req.body.desconto) > 100) {
                    return res.send({
                        ok: false,
                        msg: "O desconto deve ser maior que 0 e menor ou igual a 100%."
                    });
                }

                if (dataFim < dataInicio) {
                    return res.send({
                        ok: false,
                        msg: "A data final da promoção não pode ser menor que a data inicial."
                    });
                }

                let model = new PromocaoModel(
                    0,
                    req.body.produto,
                    req.body.desconto,
                    req.body.dataInicio,
                    req.body.dataFim,
                    req.body.ativo == "s" ? "s" : "n"
                );

                let result = await model.cadastrar();

                if (result) {
                    ok = true;
                    msg = "Promoção cadastrada com sucesso!";
                } else {
                    msg = "Não foi possível cadastrar a promoção.";
                }

            } else {
                msg = "Preencha todos os campos obrigatórios.";
            }

            res.send({ ok, msg });

        } catch (erro) {
            console.log("ERRO AO CADASTRAR PROMOÇÃO:", erro);

            res.send({
                ok: false,
                msg: "Erro interno ao cadastrar promoção."
            });
        }
    }

    async alterarView(req, res) {
        try {
            let model = new PromocaoModel();
            let promocao = await model.obter(req.params.id);

            let produtoModel = new ProdutoModel();
            let produtos = await produtoModel.listar();

            if (!promocao) {
                return res.redirect("/promocao");
            }

            res.render("promocao/alterar", {
                layout: "layout",
                promocao: promocao,
                produtos: produtos
            });

        } catch (erro) {
            console.log("ERRO AO ABRIR ALTERAÇÃO DE PROMOÇÃO:", erro);
            res.redirect("/promocao");
        }
    }

    async alterar(req, res) {
        try {
            let ok = false;
            let msg = "";

            if (
                req.body.id &&
                req.body.produto &&
                req.body.desconto &&
                req.body.dataInicio &&
                req.body.dataFim
            ) {
                let dataInicio = new Date(req.body.dataInicio);
                let dataFim = new Date(req.body.dataFim);

                if (Number(req.body.desconto) <= 0 || Number(req.body.desconto) > 100) {
                    return res.send({
                        ok: false,
                        msg: "O desconto deve ser maior que 0 e menor ou igual a 100%."
                    });
                }

                if (dataFim < dataInicio) {
                    return res.send({
                        ok: false,
                        msg: "A data final da promoção não pode ser menor que a data inicial."
                    });
                }

                let model = new PromocaoModel(
                    req.body.id,
                    req.body.produto,
                    req.body.desconto,
                    req.body.dataInicio,
                    req.body.dataFim,
                    req.body.ativo == "s" ? "s" : "n"
                );

                let result = await model.atualizar();

                if (result) {
                    ok = true;
                    msg = "Promoção alterada com sucesso!";
                } else {
                    msg = "Não foi possível alterar a promoção.";
                }

            } else {
                msg = "Preencha todos os campos obrigatórios.";
            }

            res.send({ ok, msg });

        } catch (erro) {
            console.log("ERRO AO ALTERAR PROMOÇÃO:", erro);

            res.send({
                ok: false,
                msg: "Erro interno ao alterar promoção."
            });
        }
    }

    async deletar(req, res) {
        try {
            if (!req.body.id) {
                return res.send({
                    ok: false,
                    msg: "ID da promoção não informado."
                });
            }

            let model = new PromocaoModel();
            let result = await model.deletar(req.body.id);

            if (result) {
                return res.send({
                    ok: true,
                    msg: "Promoção excluída com sucesso!"
                });
            }

            return res.send({
                ok: false,
                msg: "Não é possível excluir esta promoção enquanto ela estiver ativa."
            });

        } catch (erro) {
            console.log("ERRO AO EXCLUIR PROMOÇÃO:", erro);

            return res.send({
                ok: false,
                msg: "Erro interno ao excluir promoção."
            });
        }
    }
}

module.exports = PromocaoController;