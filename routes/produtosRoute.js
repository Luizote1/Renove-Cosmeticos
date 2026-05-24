const express = require("express");
const router = express.Router();
const multer = require("multer");

const ProdutosController = require("../controllers/produtosController");
const AuthMiddleware = require("../middlewares/authMiddleware");

let ctrl = new ProdutosController();

let auth = new AuthMiddleware();


// ==============================
// CONFIGURAÇÃO DO MULTER
// ==============================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "public/img/produtos");
    },

    filename: function(req, file, cb) {
        let nomeArq = "PRD-" + Date.now();
        let ext = file.originalname.split(".").pop()
        cb(null, `${nomeArq}.${ext}`);
    }
});

const upload = multer({storage: storage});


// ==============================
// ROTAS PÚBLICAS
// ==============================

// Página principal de produtos
router.get("/", ctrl.produtos);


// ==============================
// ROTAS PRIVADAS DO SISTEMA
// ==============================

// Listagem de produtos do sistema
router.get("/listar",auth.verificarUsuarioLogado,ctrl.listar);

// Página de cadastro de produto
router.get("/cadastrar",auth.verificarUsuarioLogado,ctrl.cadastrarView);

// Cadastro de produto
router.post("/cadastrar",auth.verificarUsuarioLogado,upload.single("imagem"),ctrl.cadastrar);

// Página de alteração de produto
router.get("/alterar/:id",auth.verificarUsuarioLogado,ctrl.alterarView);

// Alteração de produto
router.post("/alterar",auth.verificarUsuarioLogado,upload.single("imagem"),ctrl.alterar);

// Exclusão de produto
router.post("/deletar",auth.verificarUsuarioLogado,ctrl.excluir);

module.exports = router;