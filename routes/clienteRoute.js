const express = require("express");
const router = express.Router();
const ClienteController = require("../controllers/clienteController");

let controller = new ClienteController();

router.get("/", controller.listar);
router.get("/cadastrar", controller.cadastrarView);
router.post("/cadastrar", controller.cadastrar);
router.get("/alterar/:id", controller.alterarView);
router.post("/alterar", controller.alterar);
router.post("/deletar", controller.excluir);

module.exports = router;