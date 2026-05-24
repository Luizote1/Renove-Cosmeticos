const express = require("express");
const router = express.Router();
const LaboratorioController = require("../controllers/laboratorioController");

const controller = new LaboratorioController();

router.get("/", controller.listar);
router.get("/cadastrar", controller.cadastrarView);
router.post("/cadastrar", controller.cadastrar);
router.get("/alterar/:id", controller.alterarView);
router.post("/alterar", controller.alterar);
router.post("/excluir", controller.excluir);

module.exports = router;