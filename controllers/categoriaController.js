const CategoriaModel = require("../models/categoriaModel");

class CategoriaController {

    async listar(req, res) {
        try {
            let model = new CategoriaModel();
            let lista = await model.listar();

            res.render("categoria/lista", {
                layout: "layout",
                lista: lista
            });

        } catch (erro) {
            console.log("ERRO AO LISTAR CATEGORIAS:", erro);
            res.status(500).send("Erro ao listar categorias.");
        }
    }

    cadastrarView(req, res) {
        res.render("categoria/cadastrar", {
            layout: "layout"
        });
    }

    async cadastrar(req, res) {
        try {
            let ok = false;
            let msg = "";

            if (req.body.descricao && req.body.descricao.trim() !== "") {

                let model = new CategoriaModel(
                    0,
                    req.body.descricao.trim(),
                    req.body.ativo ? "s" : "n"
                );

                let result = await model.cadastrar();

                if (result) {
                    ok = true;
                    msg = "Categoria cadastrada com sucesso!";
                } else {
                    msg = "Erro ao cadastrar categoria.";
                }

            } else {
                msg = "Informe a descrição da categoria.";
            }

            res.send({ ok, msg });

        } catch (erro) {
            console.log("ERRO AO CADASTRAR CATEGORIA:", erro);

            res.send({
                ok: false,
                msg: "Erro interno ao cadastrar categoria."
            });
        }
    }

    async alterarView(req, res) {
        try {
            let model = new CategoriaModel();
            let categoria = await model.obter(req.params.id);

            if (!categoria) {
                return res.redirect("/categoria");
            }

            res.render("categoria/alterar", {
                layout: "layout",
                categoria: categoria
            });

        } catch (erro) {
            console.log("ERRO AO ABRIR ALTERAÇÃO DE CATEGORIA:", erro);
            res.redirect("/categoria");
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

                let model = new CategoriaModel(
                    req.body.id,
                    req.body.descricao.trim(),
                    req.body.ativo ? "s" : "n"
                );

                let result = await model.atualizar();

                if (result) {
                    ok = true;
                    msg = "Categoria alterada com sucesso!";
                } else {
                    msg = "Erro ao alterar categoria.";
                }

            } else {
                msg = "Dados inválidos para alteração.";
            }

            res.send({ ok, msg });

        } catch (erro) {
            console.log("ERRO AO ALTERAR CATEGORIA:", erro);

            res.send({
                ok: false,
                msg: "Erro interno ao alterar categoria."
            });
        }
    }

    async excluir(req, res) {
        try {
            if (!req.body.id) {
                return res.send({
                    ok: false,
                    msg: "ID da categoria não informado."
                });
            }

            let model = new CategoriaModel();
            let result = await model.deletar(req.body.id);

            if (result) {
                return res.send({
                    ok: true,
                    msg: "Categoria excluída com sucesso!"
                });
            }

            return res.send({
                ok: false,
                msg: "Não é possível excluir esta categoria, pois existem produtos vinculados a ela."
            });

        } catch (erro) {
            console.log("ERRO AO EXCLUIR CATEGORIA:", erro);

            return res.send({
                ok: false,
                msg: "Erro interno ao excluir categoria."
            });
        }
    }
}

module.exports = CategoriaController;