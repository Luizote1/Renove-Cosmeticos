
const ProdutoModel = require("../models/produtoModel");

class HomeController {

    async home(req, res) {

        let produtoModel = new ProdutoModel();

        let produtosDestaque = await produtoModel.listarDestaques();

        res.render("home/home", {
            layout: false,
            produtosDestaque: produtosDestaque,
            usuarioLogado: req.cookies.usuarioLogado,
            tipoLogado: req.cookies.tipoLogado
        });
    }
}

module.exports = HomeController;