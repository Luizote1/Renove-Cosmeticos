const express = require("express");
const router = express.Router();
const TipoProdutoController = require("../controllers/tipoProdutoController");

let controller = new TipoProdutoController();

router.get("/", controller.listar);
router.get("/cadastrar", controller.cadastrarView);
router.post("/cadastrar", controller.cadastrar);
router.get("/alterar/:id", controller.alterarView);
router.post("/alterar", controller.alterar);
router.post("/excluir", controller.excluir);

module.exports = router;