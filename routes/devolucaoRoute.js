const express = require("express");
const router = express.Router();

const DevolucaoController = require("../controllers/devolucaoController");

let ctrl = new DevolucaoController();

router.get("/", ctrl.listar.bind(ctrl));

router.get("/cadastrar", ctrl.cadastrarView.bind(ctrl));
router.post("/cadastrar", ctrl.cadastrar.bind(ctrl));

router.get("/itens-pedido/:id", ctrl.buscarItensPedido.bind(ctrl));

router.post("/deletar", ctrl.deletar.bind(ctrl));

module.exports = router;