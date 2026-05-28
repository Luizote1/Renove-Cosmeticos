const ProdutoModel = require("../models/produtoModel");
const CategoriaModel = require("../models/categoriaModel");
const TipoProdutoModel = require("../models/tipoProdutoModel");
const LaboratorioModel = require("../models/laboratorioModel");

class ProdutosController {

    async produtos(req, res) {
        try {
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

        } catch (erro) {
            console.log("ERRO AO LISTAR PRODUTOS DA LOJA:", erro);
            res.status(500).send("Erro ao carregar produtos.");
        }
    }

    async listar(req, res) {
        try {
            let produtoModel = new ProdutoModel();
            let lista = await produtoModel.listar();

            res.render("produto/lista", {
                layout: "layout",
                lista: lista
            });

        } catch (erro) {
            console.log("ERRO AO LISTAR PRODUTOS:", erro);

            res.render("produto/lista", {
                layout: "layout",
                lista: []
            });
        }
    }

    async cadastrarView(req, res) {
        try {
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

        } catch (erro) {
            console.log("ERRO AO ABRIR CADASTRO DE PRODUTO:", erro);
            res.redirect("/produtos/listar");
        }
    }

    async cadastrar(req, res) {
        try {
            let ok = false;
            let msg = "";

            if (
                req.body.codigo &&
                req.body.codigo.trim() !== "" &&
                req.body.nome &&
                req.body.nome.trim() !== "" &&
                req.body.preco &&
                req.body.estoque &&
                req.body.categoria &&
                req.body.categoria !== "0" &&
                req.body.tipo &&
                req.body.tipo !== "0" &&
                req.body.laboratorio &&
                req.body.laboratorio !== "0"
            ) {
                let caminhoImagem = "produto-sem-imagem.png";

                if (req.file != null) {
                    caminhoImagem = req.file.filename;
                }

                let produto = new ProdutoModel(
                    req.body.codigo.trim(),
                    req.body.nome.trim(),
                    req.body.descricao || "",
                    req.body.preco,
                    req.body.estoque,
                    req.body.validade || null,
                    req.body.ativo ? "s" : "n",
                    caminhoImagem,
                    req.body.categoria,
                    req.body.tipo,
                    req.body.laboratorio
                );

                let result = await produto.cadastrar();

                if (result) {
                    ok = true;
                    msg = "Produto cadastrado com sucesso!";
                } else {
                    msg = "Não foi possível cadastrar o produto.";
                }

            } else {
                msg = "Preencha todos os campos obrigatórios do produto.";
            }

            res.send({ ok, msg });

        } catch (erro) {
            console.log("ERRO AO CADASTRAR PRODUTO:", erro);

            res.send({
                ok: false,
                msg: "Erro interno ao cadastrar produto."
            });
        }
    }

    async alterarView(req, res) {
        try {
            let produtoModel = new ProdutoModel();
            let categoriaModel = new CategoriaModel();
            let tipoModel = new TipoProdutoModel();
            let laboratorioModel = new LaboratorioModel();

            let produto = null;

            if (req.params.id) {
                produto = await produtoModel.obter(req.params.id);
            }

            if (!produto) {
                return res.redirect("/produtos/listar");
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

        } catch (erro) {
            console.log("ERRO AO ABRIR ALTERAÇÃO DE PRODUTO:", erro);
            res.redirect("/produtos/listar");
        }
    }

    async alterar(req, res) {
        try {
            let ok = false;
            let msg = "";

            if (
                req.body.codigoAtual &&
                req.body.codigoAtual.trim() !== "" &&
                req.body.codigo &&
                req.body.codigo.trim() !== "" &&
                req.body.nome &&
                req.body.nome.trim() !== "" &&
                req.body.preco &&
                req.body.estoque &&
                req.body.categoria &&
                req.body.categoria !== "0" &&
                req.body.tipo &&
                req.body.tipo !== "0" &&
                req.body.laboratorio &&
                req.body.laboratorio !== "0"
            ) {
                let produtoModel = new ProdutoModel();
                let produtoOld = await produtoModel.obter(req.body.codigoAtual);

                if (!produtoOld) {
                    return res.send({
                        ok: false,
                        msg: "Produto não encontrado para alteração."
                    });
                }

                let imagemAtual = produtoOld.proImagem.split("/").pop();

                if (req.file != null) {
                    imagemAtual = req.file.filename;
                }

                let produto = new ProdutoModel(
                    req.body.codigo.trim(),
                    req.body.nome.trim(),
                    req.body.descricao || "",
                    req.body.preco,
                    req.body.estoque,
                    req.body.validade || null,
                    req.body.ativo ? "s" : "n",
                    imagemAtual,
                    req.body.categoria,
                    req.body.tipo,
                    req.body.laboratorio
                );

                let result = await produto.atualizar(req.body.codigoAtual);

                if (result) {
                    ok = true;
                    msg = "Produto alterado com sucesso!";
                } else {
                    msg = "Não foi possível alterar o produto.";
                }

            } else {
                msg = "Preencha corretamente todos os campos obrigatórios.";
            }

            res.send({ ok, msg });

        } catch (erro) {
            console.log("ERRO AO ALTERAR PRODUTO:", erro);

            res.send({
                ok: false,
                msg: "Erro interno ao alterar produto."
            });
        }
    }

    async excluir(req, res) {
        try {
            if (!req.body.codigo) {
                return res.send({
                    ok: false,
                    msg: "Código do produto não informado."
                });
            }

            let produtoModel = new ProdutoModel();
            let result = await produtoModel.deletar(req.body.codigo);

            if (result) {
                return res.send({
                    ok: true,
                    msg: "Produto excluído com sucesso!"
                });
            }

            return res.send({
                ok: false,
                msg: "Não é possível excluir este produto, pois ele possui pedido, recebimento, descarte ou promoção vinculada."
            });

        } catch (erro) {
            console.log("ERRO AO EXCLUIR PRODUTO:", erro);

            return res.send({
                ok: false,
                msg: "Erro interno ao excluir produto."
            });
        }
    }
}

module.exports = ProdutosController;