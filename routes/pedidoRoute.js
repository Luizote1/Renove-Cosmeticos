const express = require("express");
const PedidoController = require("../controllers/pedidoController");
const AuthMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const ctrl = new PedidoController();
const auth = new AuthMiddleware();

router.post("/gravar", auth.verificarUsuarioLogado, ctrl.gravar.bind(ctrl));

router.get("/", auth.verificarUsuarioLogado, ctrl.pedidosView.bind(ctrl));
router.get("/listar", auth.verificarUsuarioLogado, ctrl.listarPedidos.bind(ctrl));

router.get("/imprimir/:id", auth.verificarUsuarioLogado, ctrl.imprimirPedido.bind(ctrl));

router.get("/meus-pedidos", auth.verificarUsuarioLogado, ctrl.meusPedidosView.bind(ctrl));
router.get("/meus-pedidos/listar", auth.verificarUsuarioLogado, ctrl.listarMeusPedidos.bind(ctrl));

module.exports = router;