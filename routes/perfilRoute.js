const express = require("express");
const router = express.Router();

const PerfilController = require("../controllers/perfilController");

let ctrl = new PerfilController();

router.get("/", ctrl.perfil);

router.post("/atualizar-cliente", ctrl.atualizarCliente);

module.exports = router;