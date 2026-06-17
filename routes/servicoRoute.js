const express = require("express");

const router = express.Router();

const ServicoController = require("../controllers/servicoController");

let ctrl = new ServicoController();

router.get("/", ctrl.listar.bind(ctrl));

router.get("/cadastrar", ctrl.cadastrarView.bind(ctrl));
router.post("/cadastrar", ctrl.cadastrar.bind(ctrl));

router.get("/alterar/:id", ctrl.alterarView.bind(ctrl));
router.post("/alterar", ctrl.alterar.bind(ctrl));

router.post("/deletar", ctrl.excluir.bind(ctrl));

router.post("/agendar", ctrl.agendar.bind(ctrl));

router.post("/agendamento/deletar", ctrl.excluirAgendamento.bind(ctrl));

router.post("/agendamento/concluir", ctrl.concluirAgendamento.bind(ctrl));

module.exports = router;