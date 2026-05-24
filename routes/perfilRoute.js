const express = require("express");
const router = express.Router();

const PerfilController = require("../controllers/perfilController");

let ctrl = new PerfilController();

router.get("/", ctrl.perfil);

module.exports = router;