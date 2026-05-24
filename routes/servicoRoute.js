const express = require("express");
const router = express.Router();

const ServicoController = require("../controllers/servicoController");

let ctrl = new ServicoController();

router.get("/", ctrl.listar);
router.get("/cadastrar", ctrl.cadastrarView);
router.post("/cadastrar", ctrl.cadastrar);

router.get("/alterar/:id", ctrl.alterarView);
router.post("/alterar", ctrl.alterar);

router.post("/deletar", ctrl.excluir);

router.post("/agendar", ctrl.agendar);
router.post("/agendamento/deletar", ctrl.excluirAgendamento);

module.exports = router;