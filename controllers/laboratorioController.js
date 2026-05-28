const LaboratorioModel = require("../models/laboratorioModel");

class LaboratorioController {

    async listar(req, res) {
        try {
            const model = new LaboratorioModel();
            const lista = await model.listar();

            res.render("laboratorio/lista", {
                layout: "layout",
                lista: lista
            });

        } catch (erro) {
            console.log("ERRO AO LISTAR LABORATÓRIOS:", erro);

            res.render("laboratorio/lista", {
                layout: "layout",
                lista: []
            });
        }
    }

    cadastrarView(req, res) {
        res.render("laboratorio/cadastrar", {
            layout: "layout"
        });
    }

    async cadastrar(req, res) {
        try {
            let ok = false;
            let msg = "";

            if (
                req.body.nome &&
                req.body.nome.trim() !== "" &&
                req.body.telefone &&
                req.body.telefone.trim() !== "" &&
                req.body.email &&
                req.body.email.trim() !== ""
            ) {
                const model = new LaboratorioModel(
                    0,
                    req.body.nome.trim(),
                    req.body.telefone.trim(),
                    req.body.email.trim(),
                    req.body.ativo ? "s" : "n"
                );

                const result = await model.cadastrar();

                if (result) {
                    ok = true;
                    msg = "Laboratório cadastrado com sucesso!";
                } else {
                    msg = "Não foi possível cadastrar o laboratório.";
                }

            } else {
                msg = "Preencha todos os campos obrigatórios.";
            }

            res.send({ ok, msg });

        } catch (erro) {
            console.log("ERRO AO CADASTRAR LABORATÓRIO:", erro);

            res.send({
                ok: false,
                msg: "Erro interno ao cadastrar laboratório."
            });
        }
    }

    async alterarView(req, res) {
        try {
            const model = new LaboratorioModel();
            const laboratorio = await model.obter(req.params.id);

            if (!laboratorio) {
                return res.redirect("/laboratorio");
            }

            res.render("laboratorio/alterar", {
                layout: "layout",
                laboratorio: laboratorio
            });

        } catch (erro) {
            console.log("ERRO AO ABRIR ALTERAÇÃO DE LABORATÓRIO:", erro);
            res.redirect("/laboratorio");
        }
    }

    async alterar(req, res) {
        try {
            let ok = false;
            let msg = "";

            if (
                req.body.id &&
                req.body.nome &&
                req.body.nome.trim() !== "" &&
                req.body.telefone &&
                req.body.telefone.trim() !== "" &&
                req.body.email &&
                req.body.email.trim() !== ""
            ) {
                const model = new LaboratorioModel(
                    req.body.id,
                    req.body.nome.trim(),
                    req.body.telefone.trim(),
                    req.body.email.trim(),
                    req.body.ativo ? "s" : "n"
                );

                const result = await model.atualizar();

                if (result) {
                    ok = true;
                    msg = "Laboratório alterado com sucesso!";
                } else {
                    msg = "Não foi possível alterar o laboratório.";
                }

            } else {
                msg = "Preencha corretamente todos os campos.";
            }

            res.send({ ok, msg });

        } catch (erro) {
            console.log("ERRO AO ALTERAR LABORATÓRIO:", erro);

            res.send({
                ok: false,
                msg: "Erro interno ao alterar laboratório."
            });
        }
    }

    async excluir(req, res) {
        try {
            if (!req.body.id) {
                return res.send({
                    ok: false,
                    msg: "ID do laboratório não informado."
                });
            }

            const model = new LaboratorioModel();
            const result = await model.deletar(req.body.id);

            if (result) {
                return res.send({
                    ok: true,
                    msg: "Laboratório excluído com sucesso!"
                });
            }

            return res.send({
                ok: false,
                msg: "Não é possível excluir este laboratório, pois existem produtos vinculados a ele."
            });

        } catch (erro) {
            console.log("ERRO AO EXCLUIR LABORATÓRIO:", erro);

            return res.send({
                ok: false,
                msg: "Erro interno ao excluir laboratório."
            });
        }
    }
}

module.exports = LaboratorioController;