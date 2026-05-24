const homeController = require("../controllers/homeController");
const express = require('express');

let controller = new homeController;

const router = express.Router();
router.get('/', controller.home);

module.exports = router;