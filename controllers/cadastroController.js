const ClienteModel = require("../models/clienteModel");

class CadastroController {

    cadastro(req, res) {

        if (req.cookies && req.cookies.usuarioLogado) {
            return res.redirect("/");
        }

        res.render("login/cadastro", {
            layout: false
        });
    }

    async verificar(req, res) {

        try {

            let { cpf, email } = req.body;

            if (cpf) {

                let cpfLimpo = cpf.replace(/\D/g, "");

                let cpfExiste = await ClienteModel.buscarPorCpf(cpfLimpo);

                return res.send({
                    existe: cpfExiste
                });
            }

            if (email) {

                let emailExiste = await ClienteModel.buscarPorEmail(email);

                return res.send({
                    existe: emailExiste
                });
            }

            return res.send({
                existe: false
            });

        } catch (erro) {

            console.log(erro);

            return res.send({
                existe: false
            });
        }
    }

    async gravar(req, res) {

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

                let cpfExiste = await ClienteModel.buscarPorCpf(cpfLimpo);

                if (cpfExiste) {
                    return res.send({
                        ok: false,
                        msg: "Este CPF já está cadastrado."
                    });
                }

                let emailExiste = await ClienteModel.buscarPorEmail(req.body.email);

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
                    req.body.genero ? req.body.genero : "Não informar",
                    req.body.telefone,
                    req.body.email,
                    req.body.senha,
                    "s"
                );

                let result = await cliente.cadastrar();

                if (result) {

                    let clienteLogado = await cliente.autenticar(
                        req.body.email,
                        req.body.senha
                    );

                    if (clienteLogado) {

                        res.cookie("usuarioLogado", clienteLogado.cliId, {
                            httpOnly: true
                        });

                        res.cookie("tipoLogado", "cliente", {
                            httpOnly: true
                        });
                    }

                    ok = true;
                    msg = "Cadastro realizado com sucesso!";

                } else {

                    msg = "Erro ao realizar cadastro.";
                }

            } else {

                msg = "Preencha todos os campos.";
            }

            res.send({ ok, msg });

        } catch (erro) {

            console.log("ERRO NO CADASTRO:", erro);

            res.send({
                ok: false,
                msg: "Erro ao realizar cadastro."
            });
        }
    }
}

module.exports = CadastroController;