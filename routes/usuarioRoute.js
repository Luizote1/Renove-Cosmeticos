const express = require("express");

const router = express.Router();

const UsuarioController = require("../controllers/usuarioController");

const AuthMiddleware = require("../middlewares/authMiddleware");

let ctrl = new UsuarioController();

let auth = new AuthMiddleware();

router.get(
    "/",
    auth.verificarFuncionarioOuAdmin.bind(auth),
    ctrl.listarView.bind(ctrl)
);

router.get(
    "/cadastrar",
    auth.verificarAdministrador.bind(auth),
    ctrl.cadastrarView.bind(ctrl)
);

router.post(
    "/cadastrar",
    auth.verificarAdministrador.bind(auth),
    ctrl.cadastrar.bind(ctrl)
);

router.get(
    "/alterar/:idAlteracao",
    auth.verificarFuncionarioOuAdmin.bind(auth),
    ctrl.alterarView.bind(ctrl)
);

router.post(
    "/alterar",
    auth.verificarFuncionarioOuAdmin.bind(auth),
    ctrl.alterar.bind(ctrl)
);

router.post(
    "/deletar",
    auth.verificarFuncionarioOuAdmin.bind(auth),
    ctrl.deletar.bind(ctrl)
);

module.exports = router;