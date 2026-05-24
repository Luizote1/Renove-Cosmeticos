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
                usuarioLogado: req.cookies.usuarioLogado
            });
        }

        if (tipo == "cliente") {

            let clienteModel = new ClienteModel();
            let cliente = await clienteModel.obter(id);

            return res.render("perfil/perfil", {
                layout: false,
                dados: cliente,
                tipo: "cliente",
                usuarioLogado: req.cookies.usuarioLogado
            });
        }

        return res.redirect("/login");
    }
}

module.exports = PerfilController;