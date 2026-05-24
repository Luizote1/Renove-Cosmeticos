const ClienteModel = require("../models/clienteModel");

class ClienteController {

    async listar(req, res) {
        let model = new ClienteModel();
        let lista = await model.listar();

        res.render("cliente/lista", {
            layout: "layout",
            lista: lista
        });
    }

    cadastrarView(req, res) {
        res.render("cliente/cadastrar", {
            layout: "layout"
        });
    }

    async cadastrar(req, res) {
        try {
            let ok = false;
            let msg = "";

            if (
                req.body.nome &&
                req.body.cpf &&
                req.body.nascimento &&
                req.body.genero &&
                req.body.telefone &&
                req.body.email &&
                req.body.senha
            ) {
                let cpfLimpo = req.body.cpf.replace(/\D/g, "");

                let cliente = new ClienteModel(
                    0,
                    req.body.nome,
                    cpfLimpo,
                    req.body.nascimento,
                    req.body.genero,
                    req.body.telefone,
                    req.body.email,
                    req.body.senha,
                    req.body.ativo == "s" ? "s" : "n"
                );

                let result = await cliente.cadastrar();

                if (result) {
                    ok = true;
                    msg = "Cliente cadastrado!";
                } else {
                    msg = "Erro ao cadastrar cliente.";
                }
            } else {
                msg = "Preencha os campos!";
            }

            res.send({ ok, msg });
        } catch (erro) {
            console.log("ERRO AO CADASTRAR CLIENTE:", erro);
            res.send({
                ok: false,
                msg: "Erro ao cadastrar cliente."
            });
        }
    }

    async alterarView(req, res) {
        let model = new ClienteModel();
        let cliente = await model.obter(req.params.id);

        res.render("cliente/alterar", {
            layout: "layout",
            cliente: cliente
        });
    }

    async alterar(req, res) {
        try {
            let ok = false;
            let msg = "";

            if (
                req.body.id &&
                req.body.nome &&
                req.body.cpf &&
                req.body.nascimento &&
                req.body.genero &&
                req.body.telefone &&
                req.body.email &&
                req.body.senha
            ) {
                let cpfLimpo = req.body.cpf.replace(/\D/g, "");

                let cliente = new ClienteModel(
                    req.body.id,
                    req.body.nome,
                    cpfLimpo,
                    req.body.nascimento,
                    req.body.genero,
                    req.body.telefone,
                    req.body.email,
                    req.body.senha,
                    req.body.ativo == "s" ? "s" : "n"
                );

                let result = await cliente.atualizar();

                if (result) {
                    ok = true;
                    msg = "Cliente alterado!";
                } else {
                    msg = "Erro ao alterar cliente.";
                }
            } else {
                msg = "Preencha os campos!";
            }

            res.send({ ok, msg });
        } catch (erro) {
            console.log("ERRO AO ALTERAR CLIENTE:", erro);
            res.send({
                ok: false,
                msg: "Erro ao alterar cliente."
            });
        }
    }

    async excluir(req, res) {
        let ok = false;
        let msg = "";

        if (req.body.id) {
            let model = new ClienteModel();
            let result = await model.deletar(req.body.id);

            if (result) {
                ok = true;
                msg = "Cliente excluído!";
            } else {
                msg = "Erro ao excluir cliente.";
            }
        } else {
            msg = "ID não informado.";
        }

        res.send({ ok, msg });
    }
}

module.exports = ClienteController;