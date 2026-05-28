const ClienteModel = require("../models/clienteModel");

class ClienteController {

    async listar(req, res) {

        try {

            let model = new ClienteModel();
            let lista = await model.listar();

            res.render("cliente/lista", {
                layout: "layout",
                lista: lista
            });

        } catch (erro) {

            console.log("ERRO AO LISTAR CLIENTES:", erro);

            res.render("cliente/lista", {
                layout: "layout",
                lista: []
            });
        }
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

                let cpfLimpo =
                    req.body.cpf.replace(/\D/g, "");

                let cpfExiste =
                    await ClienteModel.buscarPorCpf(cpfLimpo);

                if (cpfExiste) {

                    return res.send({
                        ok: false,
                        msg: "Este CPF já está cadastrado."
                    });
                }

                let emailExiste =
                    await ClienteModel.buscarPorEmail(req.body.email);

                if (emailExiste) {

                    return res.send({
                        ok: false,
                        msg: "Este e-mail já está cadastrado."
                    });
                }

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

                let result =
                    await cliente.cadastrar();

                if (result) {

                    ok = true;
                    msg = "Cliente cadastrado com sucesso!";

                } else {

                    msg = "Não foi possível cadastrar o cliente.";
                }

            } else {

                msg = "Preencha todos os campos obrigatórios.";
            }

            res.send({ ok, msg });

        } catch (erro) {

            console.log("ERRO AO CADASTRAR CLIENTE:", erro);

            res.send({
                ok: false,
                msg: "Erro interno ao cadastrar cliente."
            });
        }
    }

    async alterarView(req, res) {

        try {

            let model = new ClienteModel();

            let cliente =
                await model.obter(req.params.id);

            if (!cliente) {
                return res.redirect("/cliente");
            }

            res.render("cliente/alterar", {
                layout: "layout",
                cliente: cliente
            });

        } catch (erro) {

            console.log(
                "ERRO AO ABRIR ALTERAÇÃO CLIENTE:",
                erro
            );

            res.redirect("/cliente");
        }
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

                let cpfLimpo =
                    req.body.cpf.replace(/\D/g, "");

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

                let result =
                    await cliente.atualizar();

                if (result) {

                    ok = true;
                    msg = "Cliente alterado com sucesso!";

                } else {

                    msg = "Não foi possível alterar o cliente.";
                }

            } else {

                msg = "Preencha corretamente todos os campos.";
            }

            res.send({ ok, msg });

        } catch (erro) {

            console.log(
                "ERRO AO ALTERAR CLIENTE:",
                erro
            );

            res.send({
                ok: false,
                msg: "Erro interno ao alterar cliente."
            });
        }
    }

    async excluir(req, res) {

        try {

            if (!req.body.id) {

                return res.send({
                    ok: false,
                    msg: "ID do cliente não informado."
                });
            }

            let model =
                new ClienteModel();

            let result =
                await model.deletar(req.body.id);

            if (result) {

                return res.send({
                    ok: true,
                    msg: "Cliente excluído com sucesso!"
                });
            }

            return res.send({
                ok: false,
                msg: "Não é possível excluir este cliente, pois ele possui pedidos vinculados."
            });

        } catch (erro) {

            console.log(
                "ERRO AO EXCLUIR CLIENTE:",
                erro
            );

            return res.send({
                ok: false,
                msg: "Erro interno ao excluir cliente."
            });
        }
    }
}

module.exports = ClienteController;