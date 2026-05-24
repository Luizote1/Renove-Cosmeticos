const express = require("express");
const router = express.Router();

const CadastroController = require("../controllers/cadastroController");

let ctrl = new CadastroController();

router.get("/", ctrl.cadastro);

router.post("/gravar", ctrl.gravar);

// NOVA ROTA
router.post("/verificar", ctrl.verificar);

module.exports = router;