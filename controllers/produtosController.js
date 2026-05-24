const ProdutoModel = require("../models/produtoModel");
const CategoriaModel = require("../models/categoriaModel");
const TipoProdutoModel = require("../models/tipoProdutoModel");
const LaboratorioModel = require("../models/laboratorioModel");
const fs = require("fs");

class ProdutosController {

    async produtos(req, res) {

        let produtoModel = new ProdutoModel();
        let lista = await produtoModel.listarAtivos();

        let produtosJson = [];

        for (let i = 0; i < lista.length; i++) {
            produtosJson.push(lista[i].toJSON());
        }

        res.render("produto/produtos", {
            layout: false,
            lista: lista,
            produtosJson: JSON.stringify(produtosJson),

            usuarioLogado: req.cookies && req.cookies.usuarioLogado,
            tipoLogado: req.cookies && req.cookies.tipoLogado
        });

    }



    async listar(req, res) {
        let produtoModel = new ProdutoModel();
        let lista = await produtoModel.listar();

        res.render("produto/lista", {
            layout: "layout",
            lista: lista
        });
    }

    async cadastrarView(req, res) {
        let categoriaModel = new CategoriaModel();
        let tipoModel = new TipoProdutoModel();
        let laboratorioModel = new LaboratorioModel();

        let listaCategorias = await categoriaModel.listar();
        let listaTipos = await tipoModel.listar();
        let listaLaboratorios = await laboratorioModel.listar();

        res.render("produto/cadastrar", {
            layout: "layout",
            listaCategorias,
            listaTipos,
            listaLaboratorios
        });
    }

    async cadastrar(req, res) {
        var ok = true;

        if (
            req.body.codigo != "" &&
            req.body.nome != "" &&
            req.body.preco != "" &&
            req.body.estoque != "" &&
            req.body.categoria != "0" &&
            req.body.tipo != "0" &&
            req.body.laboratorio != "0"
        ) {
            let caminhoImagem = "produto-sem-imagem.png";

            if (req.file != null) {
                caminhoImagem = req.file.filename;
            }

            let produto = new ProdutoModel(
                req.body.codigo,
                req.body.nome,
                req.body.descricao,
                req.body.preco,
                req.body.estoque,
                req.body.validade,
                req.body.ativo,
                caminhoImagem,
                req.body.categoria,
                req.body.tipo,
                req.body.laboratorio
            );

            ok = await produto.cadastrar();
        }
        else {
            ok = false;
        }

        res.send({ ok: ok });
    }

    async alterarView(req, res) {
        let produtoModel = new ProdutoModel();
        let categoriaModel = new CategoriaModel();
        let tipoModel = new TipoProdutoModel();
        let laboratorioModel = new LaboratorioModel();

        let produto = null;

        if (req.params.id) {
            produto = await produtoModel.obter(req.params.id);
        }

        let listaCategorias = await categoriaModel.listar();
        let listaTipos = await tipoModel.listar();
        let listaLaboratorios = await laboratorioModel.listar();

        res.render("produto/alterar", {
            layout: "layout",
            produto,
            listaCategorias,
            listaTipos,
            listaLaboratorios
        });
    }

    async alterar(req, res) {
        var ok = true;

        if (
            req.body.codigoAtual != "" &&
            req.body.codigo != "" &&
            req.body.nome != "" &&
            req.body.estoque != "" &&
            req.body.estoque != "0" &&
            req.body.categoria != "0" &&
            req.body.tipo != "0" &&
            req.body.laboratorio != "0" &&
            req.body.preco != ""
        ) {
            let produto = new ProdutoModel(
                req.body.codigo,
                req.body.nome,
                req.body.descricao,
                req.body.preco,
                req.body.estoque,
                req.body.validade,
                req.body.ativo,
                "",
                req.body.categoria,
                req.body.tipo,
                req.body.laboratorio
            );

            let produtoOld = await produto.obter(req.body.codigoAtual);

            if (req.file != null) {
                let nomeImg = produtoOld.proImagem.split("/").pop();

                if (
                    nomeImg != "produto-sem-imagem.png" &&
                    fs.existsSync(global.CAMINHO_IMG_ABS + nomeImg)
                ) {
                    fs.unlinkSync(global.CAMINHO_IMG_ABS + nomeImg);
                }

                produto.proImagem = req.file.filename;
            }
            else {
                produto.proImagem = produtoOld.proImagem.split("/").pop();
            }

            ok = await produto.atualizar(req.body.codigoAtual);
        }
        else {
            ok = false;
        }

        res.send({ ok: ok });
    }

    async excluir(req, res) {
        var ok = true;

        if (req.body.codigo != "") {
            let produtoModel = new ProdutoModel();
            let produto = await produtoModel.obter(req.body.codigo);

            if (produto) {
                let nomeImg = produto.proImagem.split("/").pop();

                if (
                    nomeImg != "produto-sem-imagem.png" &&
                    fs.existsSync(global.CAMINHO_IMG_ABS + nomeImg)
                ) {
                    fs.unlinkSync(global.CAMINHO_IMG_ABS + nomeImg);
                }

                ok = await produtoModel.deletar(req.body.codigo);
            }
            else {
                ok = false;
            }
        }
        else {
            ok = false;
        }

        res.send({ ok: ok });
    }
}

module.exports = ProdutosController;