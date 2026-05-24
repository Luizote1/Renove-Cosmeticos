const UsuarioModel = require("../models/usuarioModel");
const ClienteModel = require("../models/clienteModel");

class PerfilController {

    async perfil(req, res) {

        if (!req.cookies.usuarioLogado) {
            return res.redirect("/login");
        }

        let id = req.cookies.usuarioLogado;
        let tipo = req.cookies.tipoLogado;

        if (tipo == "usuario") {

            let usuarioModel = new UsuarioModel();
            let usuario = await usuarioModel.obter(id);

            return res.render("perfil/perfil", {
                layout: false,
                dados: usuario,
                tipo: "usuario",
                usuarioLogado: req.cookies.usuarioLogado,
                msg: ""
            });
        }

        if (tipo == "cliente") {

            let clienteModel = new ClienteModel();
            let cliente = await clienteModel.obter(id);

            return res.render("perfil/perfil", {
                layout: false,
                dados: cliente,
                tipo: "cliente",
                usuarioLogado: req.cookies.usuarioLogado,
                msg: ""
            });
        }

        return res.redirect("/login");
    }

    async atualizarCliente(req, res) {

        if (!req.cookies.usuarioLogado || req.cookies.tipoLogado != "cliente") {
            return res.send({
                ok: false,
                msg: "Acesso negado."
            });
        }

        if (
            req.body.nome != "" &&
            req.body.nascimento != "" &&
            req.body.genero != "" &&
            req.body.telefone != ""
        ) {

            let cliente = new ClienteModel(
                req.cookies.usuarioLogado,
                req.body.nome,
                "",
                req.body.nascimento,
                req.body.genero,
                req.body.telefone,
                "",
                "",
                "s"
            );

            let ok = await cliente.atualizarPerfil();

            return res.send({
                ok: ok,
                msg: ok ? "Perfil atualizado com sucesso!" : "Erro ao atualizar perfil."
            });
        }

        return res.send({
            ok: false,
            msg: "Preencha todos os campos permitidos."
        });
    }
}

module.exports = PerfilController;