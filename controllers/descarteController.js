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
                req.body.motivo
            ) {
                let quantidade = Number(req.body.quantidade);

                if (!Number.isInteger(quantidade) || quantidade <= 0) {
                    return res.send({
                        ok: false,
                        msg: "A quantidade do descarte deve ser um número inteiro maior que zero."
                    });
                }

                let dataAtual = new Date();

                let model = new DescarteModel(
                    0,
                    req.body.produto,
                    quantidade,
                    dataAtual,
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
            if (
                !req.body.id ||
                !req.body.produto ||
                !req.body.quantidade ||
                !req.body.motivo
            ) {
                return res.send({
                    ok: false,
                    msg: "Preencha todos os campos obrigatórios."
                });
            }

            let quantidade = Number(req.body.quantidade);

            if (!Number.isInteger(quantidade) || quantidade <= 0) {
                return res.send({
                    ok: false,
                    msg: "A quantidade deve ser um número inteiro maior que zero."
                });
            }

            let modelBusca = new DescarteModel();

            let descarteAntigo = await modelBusca.obter(req.body.id);

            if (!descarteAntigo) {
                return res.send({
                    ok: false,
                    msg: "Descarte não encontrado."
                });
            }

            let estoqueAtual = await modelBusca.obterEstoqueProduto(req.body.produto);

            if (estoqueAtual === null) {
                return res.send({
                    ok: false,
                    msg: "Produto não encontrado."
                });
            }

            if (quantidade > estoqueAtual) {
                return res.send({
                    ok: false,
                    msg: "Estoque insuficiente. Você só pode descartar até " + estoqueAtual + " unidades."
                });
            }

            let modelAntigo = new DescarteModel(
                descarteAntigo.des_id,
                descarteAntigo.pro_codigo,
                descarteAntigo.des_quantidade,
                descarteAntigo.des_data,
                descarteAntigo.des_motivo,
                descarteAntigo.des_observacao
            );

            await modelAntigo.devolverEstoque(
                descarteAntigo.des_quantidade,
                descarteAntigo.pro_codigo
            );

            let modelNovo = new DescarteModel(
                req.body.id,
                req.body.produto,
                quantidade,
                descarteAntigo.des_data,
                req.body.motivo,
                req.body.observacao
            );

            let baixou = await modelNovo.baixarEstoque();

            if (!baixou || baixou.affectedRows <= 0) {
                await modelAntigo.baixarEstoque();

                return res.send({
                    ok: false,
                    msg: "Estoque insuficiente para alterar este descarte."
                });
            }

            let result = await modelNovo.atualizar();

            if (result) {
                return res.send({
                    ok: true,
                    msg: "Descarte alterado com sucesso! O estoque foi ajustado."
                });
            }

            await modelNovo.devolverEstoque(quantidade, req.body.produto);
            await modelAntigo.baixarEstoque();

            return res.send({
                ok: false,
                msg: "Não foi possível alterar o descarte."
            });

        } catch (erro) {
            console.log("ERRO AO ALTERAR DESCARTE:", erro);

            return res.send({
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