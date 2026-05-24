const LaboratorioModel = require("../models/laboratorioModel");

class LaboratorioController {
    async listar(req, res) {
        const model = new LaboratorioModel();
        const lista = await model.listar();

        res.render("laboratorio/lista", {
            layout: "layout",
            lista: lista
        });
    }

    cadastrarView(req, res) {
        res.render("laboratorio/cadastrar", {
            layout: "layout"
        });
    }

    async cadastrar(req, res) {
        const model = new LaboratorioModel(
            0,
            req.body.nome,
            req.body.telefone,
            req.body.email,
            req.body.ativo ? "s" : "n"
        );

        const result = await model.cadastrar();

        res.send({
            ok: !!result,
            msg: result ? "Laboratório cadastrado com sucesso!" : "Erro ao cadastrar laboratório."
        });
    }

    async alterarView(req, res) {
        const model = new LaboratorioModel();
        const laboratorio = await model.obter(req.params.id);

        res.render("laboratorio/alterar", {
            layout: "layout",
            laboratorio: laboratorio
        });
    }

    async alterar(req, res) {
        const model = new LaboratorioModel(
            req.body.id,
            req.body.nome,
            req.body.telefone,
            req.body.email,
            req.body.ativo ? "s" : "n"
        );

        const result = await model.atualizar();

        res.send({
            ok: !!result,
            msg: result ? "Laboratório alterado com sucesso!" : "Erro ao alterar laboratório."
        });
    }

    async excluir(req, res) {
        try {
            if (!req.body.id) {
                return res.send({
                    ok: false,
                    msg: "ID não informado."
                });
            }

            const model = new LaboratorioModel();
            const result = await model.deletar(req.body.id);

            return res.send({
                ok: !!result,
                msg: result ? "Laboratório excluído com sucesso!" : "Erro ao excluir laboratório."
            });
        } catch (erro) {
            console.error(erro);
            return res.send({
                ok: false,
                msg: "Erro interno ao excluir laboratório."
            });
        }
    }
}

module.exports = LaboratorioController;