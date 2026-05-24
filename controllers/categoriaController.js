const CategoriaModel = require("../models/categoriaModel");

class CategoriaController {

    async listar(req, res) {
        let model = new CategoriaModel();
        let lista = await model.listar();

        res.render("categoria/lista", {
            layout: "layout",
            lista: lista
        });
    }

    cadastrarView(req, res) {
        res.render("categoria/cadastrar", {
            layout: "layout"
        });
    }

    async cadastrar(req, res) {
        let model = new CategoriaModel(
            0,
            req.body.descricao,
            req.body.ativo ? "s" : "n"
        );

        await model.cadastrar();

        res.send({
            ok: true,
            msg: "Categoria cadastrada com sucesso"
        });
    }

    async alterarView(req, res) {
        let model = new CategoriaModel();
        let categoria = await model.obter(req.params.id);

        res.render("categoria/alterar", {
            layout: "layout",
            categoria: categoria
        });
    }

    async alterar(req, res) {
        let model = new CategoriaModel(
            req.body.id,
            req.body.descricao,
            req.body.ativo ? "s" : "n"
        );

        await model.atualizar();

        res.send({
            ok: true,
            msg: "Categoria alterada com sucesso"
        });
    }

    async excluir(req, res) {
        let model = new CategoriaModel();
        await model.deletar(req.body.id);

        res.send({
            ok: true,
            msg: "Categoria excluída com sucesso"
        });
    }
}

module.exports = CategoriaController;