const UsuarioModel = require("../models/usuarioModel");
const ClienteModel = require("../models/clienteModel");

class AuthMiddleware {

    async verificarUsuarioLogado(req, res, next) {

        if (req.cookies.usuarioLogado) {

            let id = req.cookies.usuarioLogado;

            let usuarioModel = new UsuarioModel();
            let usuario = await usuarioModel.obter(id);

            if (usuario) {

                req.usuarioLogado = usuario;
                req.tipoLogado = "usuario";

                return next();
            }

            let clienteModel = new ClienteModel();
            let cliente = await clienteModel.obter(id);

            if (cliente) {

                req.usuarioLogado = cliente;
                req.tipoLogado = "cliente";

                return next();
            }
        }

        return res.redirect("/login");
    }
}

module.exports = AuthMiddleware;