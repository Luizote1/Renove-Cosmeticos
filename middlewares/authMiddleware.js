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

    async verificarAdministrador(req, res, next) {

        if (!req.cookies.usuarioLogado) {
            return res.redirect("/login");
        }

        let usuarioModel = new UsuarioModel();

        let usuario = await usuarioModel.obter(
            req.cookies.usuarioLogado
        );

        if (!usuario) {
            return res.redirect("/login");
        }

        if (Number(usuario.perfilId) !== 1) {

            return res.status(403).send(
                "Acesso negado. Apenas administradores."
            );
        }

        req.usuarioLogado = usuario;
        req.tipoLogado = "usuario";

        next();
    }

    async verificarFuncionarioOuAdmin(req, res, next) {

        if (!req.cookies.usuarioLogado) {
            return res.redirect("/login");
        }

        let usuarioModel = new UsuarioModel();

        let usuario = await usuarioModel.obter(
            req.cookies.usuarioLogado
        );

        if (!usuario) {
            return res.redirect("/login");
        }

        if (
            Number(usuario.perfilId) !== 1 &&
            Number(usuario.perfilId) !== 2
        ) {
            return res.status(403).send(
                "Acesso negado."
            );
        }

        req.usuarioLogado = usuario;
        req.tipoLogado = "usuario";

        next();
    }

}

module.exports = AuthMiddleware;