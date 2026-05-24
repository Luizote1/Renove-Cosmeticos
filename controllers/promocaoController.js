const PromocaoModel = require("../models/promocaoModel");
const ProdutoModel = require("../models/produtoModel");

class PromocaoController {

    async listar(req, res) {
        let model = new PromocaoModel();

        let lista = await model.listar();
        let proximosVencimento = await model.listarProdutosProximosVencimento();

        res.render("promocao/lista", {
            layout: "layout",
            lista: lista,
            proximosVencimento: proximosVencimento
        });
    }

    async cadastrarView(req, res) {
        let produtoModel = new ProdutoModel();
        let produtos = await produtoModel.listar();

        res.render("promocao/cadastrar", {
            layout: "layout",
            produtos: produtos
        });
    }

    async cadastrar(req, res) {
        let ok = false;
        let msg = "";

        if (
            req.body.produto &&
            req.body.desconto &&
            req.body.dataInicio &&
            req.body.dataFim
        ) {
            let model = new PromocaoModel(
                0,
                req.body.produto,
                req.body.desconto,
                req.body.dataInicio,
                req.body.dataFim,
                req.body.ativo == "s" ? "s" : "n"
            );

            ok = await model.cadastrar();

            msg = ok ? "Promoção cadastrada!" : "Erro ao cadastrar promoção.";
        } else {
            msg = "Preencha os campos obrigatórios.";
        }

        res.send({ ok, msg });
    }

    async alterarView(req, res) {
        let model = new PromocaoModel();
        let promocao = await model.obter(req.params.id);

        let produtoModel = new ProdutoModel();
        let produtos = await produtoModel.listar();

        res.render("promocao/alterar", {
            layout: "layout",
            promocao: promocao,
            produtos: produtos
        });
    }

    async alterar(req, res) {
        let ok = false;
        let msg = "";

        if (
            req.body.id &&
            req.body.produto &&
            req.body.desconto &&
            req.body.dataInicio &&
            req.body.dataFim
        ) {
            let model = new PromocaoModel(
                req.body.id,
                req.body.produto,
                req.body.desconto,
                req.body.dataInicio,
                req.body.dataFim,
                req.body.ativo == "s" ? "s" : "n"
            );

            ok = await model.atualizar();

            msg = ok ? "Promoção alterada!" : "Erro ao alterar promoção.";
        } else {
            msg = "Preencha os campos obrigatórios.";
        }

        res.send({ ok, msg });
    }

    async deletar(req, res) {
        let model = new PromocaoModel();
        let ok = await model.deletar(req.body.id);

        res.send({
            ok: ok,
            msg: ok ? "Promoção excluída!" : "Erro ao excluir promoção."
        });
    }
}

module.exports = PromocaoController;