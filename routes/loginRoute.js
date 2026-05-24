const express = require("express");
const router = express.Router();
const LoginController = require("../controllers/loginController");

let ctrl = new LoginController();

router.get("/", ctrl.loginView);
router.post("/", ctrl.autenticar);
router.get("/logout", ctrl.logout);

module.exports = router;