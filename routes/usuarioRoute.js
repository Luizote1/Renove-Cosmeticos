const express = require("express");

const router = express.Router();

const UsuarioController = require("../controllers/usuarioController");

const AuthMiddleware = require("../middlewares/authMiddleware");

let ctrl = new UsuarioController();

let auth = new AuthMiddleware();

router.get("/",auth.verificarUsuarioLogado.bind(auth),ctrl.listarView);

router.get("/cadastrar",auth.verificarUsuarioLogado.bind(auth),ctrl.cadastrarView);

router.get("/alterar/:idAlteracao",auth.verificarUsuarioLogado.bind(auth),ctrl.alterarView);

router.post("/cadastrar",auth.verificarUsuarioLogado.bind(auth),ctrl.cadastrar);

router.post("/alterar",auth.verificarUsuarioLogado.bind(auth),ctrl.alterar);

router.post("/deletar",auth.verificarUsuarioLogado.bind(auth),ctrl.deletar);

module.exports = router;