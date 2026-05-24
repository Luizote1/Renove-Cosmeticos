require("dotenv").config();

// ==============================
// IMPORTAÇÕES
// ==============================

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const path = require("path");
const AuthMiddleware = require("./middlewares/authMiddleware");


// ==============================
// IMPORTAÇÃO DAS ROTAS
// ==============================

const homeRoute = require("./routes/homeRoute");
const checkoutRoute = require("./routes/checkoutRoute");
const loginRoute = require("./routes/loginRoute");
const cadastroRoute = require("./routes/cadastroRoute");
const produtosRoute = require("./routes/produtosRoute");
const usuarioRoute = require("./routes/usuarioRoute");
const clienteRoute = require("./routes/clienteRoute");
const tipoProdutoRoute = require("./routes/tipoProdutoRoute");
const laboratorioRoute = require("./routes/laboratorioRoute");
const categoriaRoute = require("./routes/categoriaRoute");
const servicoRoute = require("./routes/servicoRoute");
const perfilRoute = require("./routes/perfilRoute");
const recebimentoRoute = require("./routes/recebimentoRoute");
const descarteRoute = require("./routes/descarteRoute");
const promocaoRoute = require("./routes/promocaoRoute");
const pedidoRoute = require("./routes/pedidoRoute");


// ==============================
// CONFIGURAÇÃO DO SERVIDOR
// ==============================

const server = express();


// ==============================
// CONFIGURAÇÃO DO EJS
// ==============================

server.set("view engine", "ejs");
server.set("layout", "./layout");

// CORREÇÃO PARA VERCEL
server.set(
    "views",
    path.join(__dirname, "views")
);


// ==============================
// MIDDLEWARES
// ==============================

// CORREÇÃO PARA VERCEL
server.use(
    express.static(
        path.join(__dirname, "public")
    )
);

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(expressLayouts);
server.use(cookieParser());


// ==============================
// ROTAS PÚBLICAS
// ==============================

server.use("/", homeRoute);
server.use("/login", loginRoute);
server.use("/cadastro", cadastroRoute);
server.use("/produtos", produtosRoute);
server.use("/perfil", perfilRoute);


// ==============================
// MIDDLEWARE DE AUTENTICAÇÃO
// ==============================

let auth = new AuthMiddleware();

// CORREÇÃO CONTEXT BIND
server.use(
    auth.verificarUsuarioLogado.bind(auth)
);


// ==============================
// ROTAS PRIVADAS
// ==============================

server.use("/checkout", checkoutRoute);
server.use("/usuario", usuarioRoute);
server.use("/cliente", clienteRoute);
server.use("/tipoproduto", tipoProdutoRoute);
server.use("/laboratorio", laboratorioRoute);
server.use("/categoria", categoriaRoute);
server.use("/servico", servicoRoute);
server.use("/recebimento", recebimentoRoute);
server.use("/descarte", descarteRoute);
server.use("/promocao", promocaoRoute);
server.use("/pedido", pedidoRoute);


// ==============================
// VARIÁVEIS GLOBAIS
// ==============================

global.CAMINHO_IMG = "/img/produtos/";

// CORREÇÃO PARA VERCEL
global.CAMINHO_IMG_ABS =
    path.join(
        __dirname,
        "public",
        "img",
        "produtos"
    ) + path.sep;


// ==============================
// INICIALIZAÇÃO DO SERVIDOR
// ==============================

// LOCALHOST
if (process.env.NODE_ENV !== "production") {

    server.listen(
        5000,
        "0.0.0.0",
        function () {

            console.log(
                "Servidor funcionando!"
            );
        }
    );
}

// EXPORTAÇÃO PARA VERCEL
module.exports = server;