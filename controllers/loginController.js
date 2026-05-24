const UsuarioModel = require("../models/usuarioModel");
const ClienteModel = require("../models/clienteModel");

class LoginController {

    loginView(req, res) {

        if (req.cookies && req.cookies.usuarioLogado) {
            return res.redirect("/");
        }

        res.render("login/login", {
            layout: false,
            msg: ""
        });
    }

    async autenticar(req, res) {

        try {

            let { emailCpf, senha } = req.body;

            if (!emailCpf || !senha) {
                return res.render("login/login", {
                    layout: false,
                    msg: "Preencha os campos corretamente"
                });
            }

            emailCpf = emailCpf.trim();

            let emailCpfLimpo = emailCpf.replace(/\D/g, "");

            let usuarioModel = new UsuarioModel();
            let usuario = await usuarioModel.autenticar(emailCpf, senha);

            if (usuario) {

                res.cookie("usuarioLogado", usuario.usuId, {
                    httpOnly: true
                });

                res.cookie("tipoLogado", "usuario", {
                    httpOnly: true
                });

                return res.redirect("/usuario");
            }

            let clienteModel = new ClienteModel();

            let cliente = await clienteModel.autenticar(emailCpf, senha);

            if (!cliente) {
                cliente = await clienteModel.autenticar(emailCpfLimpo, senha);
            }

            if (cliente) {

                res.cookie("usuarioLogado", cliente.cliId, {
                    httpOnly: true
                });

                res.cookie("tipoLogado", "cliente", {
                    httpOnly: true
                });

                return res.redirect("/");
            }

            return res.render("login/login", {
                layout: false,
                msg: "Usuário ou senha inválidos"
            });

        }
        catch (erro) {

            console.log(erro);

            return res.render("login/login", {
                layout: false,
                msg: "Erro ao autenticar"
            });
        }
    }

    logout(req, res) {

        res.clearCookie("usuarioLogado");
        res.clearCookie("tipoLogado");

        return res.redirect("/");
    }
}

module.exports = LoginController;