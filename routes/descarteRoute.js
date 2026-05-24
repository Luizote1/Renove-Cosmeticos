const express = require("express");
const router = express.Router();

const DescarteController = require("../controllers/descarteController");

let ctrl = new DescarteController();

router.get("/", ctrl.listar);

router.get("/cadastrar", ctrl.cadastrarView);
router.post("/cadastrar", ctrl.cadastrar);

router.get("/alterar/:id", ctrl.alterarView);
router.post("/alterar", ctrl.alterar);

router.post("/deletar", ctrl.deletar);

module.exports = router;