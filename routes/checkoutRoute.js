const express = require("express");
const router = express.Router();

const CheckoutController = require("../controllers/checkoutController");

const controller = new CheckoutController();

router.get("/", controller.checkout.bind(controller));

router.post("/finalizar", controller.finalizarCompra.bind(controller));

module.exports = router;