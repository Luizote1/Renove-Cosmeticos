const PerfilModel = require("../models/perfilModel");
const UsuarioModel = require("../models/usuarioModel");

class UsuarioController {

    async listarView(req, res) {
        try {
            let usuario = new UsuarioModel();
            let lista = await usuario.listar();

            res.render("usuario/listar", {
                lista: lista,
                layout: "layout"
            });

        } catch (erro) {
            console.log("ERRO AO LISTAR USUÁRIOS:", erro);

            res.render("usuario/listar", {
                lista: [],
                layout: "layout"
            });
        }
    }

    async cadastrarView(req, res) {
        try {
            let perfil = new PerfilModel();
            let listaPerfil = await perfil.listar();

            res.render("usuario/cadastrar", {
                listaPerfil: listaPerfil,
                layout: "layout"
            });

        } catch (erro) {
            console.log("ERRO AO ABRIR CADASTRO DE USUÁRIO:", erro);
            res.redirect("/usuario");
        }
    }

    async alterarView(req, res) {
        try {
            let perfil = new PerfilModel();
            let listaPerfil = await perfil.listar();

            let usuarioModel = new UsuarioModel();
            let usuario = await usuarioModel.obter(req.params.idAlteracao);

            if (!usuario) {
                return res.redirect("/usuario");
            }

            res.render("usuario/alterar", {
                listaPerfil: listaPerfil,
                usuario: usuario,
                layout: "layout"
            });

        } catch (erro) {
            console.log("ERRO AO ABRIR ALTERAÇÃO DE USUÁRIO:", erro);
            res.redirect("/usuario");
        }
    }

    async cadastrar(req, res) {
        try {
            let ok = false;
            let msg = "";

            if (
                req.body.nome &&
                req.body.nome.trim() !== "" &&
                req.body.email &&
                req.body.email.trim() !== "" &&
                req.body.senha &&
                req.body.senha.trim() !== "" &&
                req.body.perfil &&
                req.body.perfil != "0"
            ) {
                let usuario = new UsuarioModel(
                    0,
                    req.body.nome.trim(),
                    req.body.email.trim(),
                    req.body.senha,
                    req.body.ativo == true ? "s" : "n",
                    req.body.perfil
                );

                let result = await usuario.cadastrar();

                if (result) {
                    ok = true;
                    msg = "Usuário cadastrado com sucesso!";
                } else {
                    msg = "Não foi possível cadastrar o usuário.";
                }

            } else {
                msg = "Preencha todos os campos obrigatórios do usuário.";
            }

            res.send({ ok, msg });

        } catch (erro) {
            console.log("ERRO AO CADASTRAR USUÁRIO:", erro);

            res.send({
                ok: false,
                msg: "Erro interno ao cadastrar usuário."
            });
        }
    }

    async alterar(req, res) {
        try {
            let ok = false;
            let msg = "";

            if (
                req.body.id &&
                req.body.id != "0" &&
                req.body.nome &&
                req.body.nome.trim() !== "" &&
                req.body.email &&
                req.body.email.trim() !== "" &&
                req.body.senha &&
                req.body.senha.trim() !== "" &&
                req.body.perfil &&
                req.body.perfil != "0"
            ) {
                let usuario = new UsuarioModel(
                    req.body.id,
                    req.body.nome.trim(),
                    req.body.email.trim(),
                    req.body.senha,
                    req.body.ativo == true ? "s" : "n",
                    req.body.perfil
                );

                let result = await usuario.atualizar();

                if (result) {
                    ok = true;
                    msg = "Usuário alterado com sucesso!";
                } else {
                    msg = "Não foi possível alterar o usuário.";
                }

            } else {
                msg = "Preencha corretamente todos os campos obrigatórios.";
            }

            res.send({ ok, msg });

        } catch (erro) {
            console.log("ERRO AO ALTERAR USUÁRIO:", erro);

            res.send({
                ok: false,
                msg: "Erro interno ao alterar usuário."
            });
        }
    }

    async deletar(req, res) {
        try {
            if (!req.body.id || req.body.id == "0") {
                return res.send({
                    ok: false,
                    msg: "ID do usuário não informado."
                });
            }

            let usuario = new UsuarioModel();

            let result = await usuario.deletar(
                req.body.id,
                req.cookies.usuarioLogado
            );

            if (result) {
                return res.send({
                    ok: true,
                    msg: "Usuário excluído com sucesso!"
                });
            }

            return res.send({
                ok: false,
                msg: "Não é possível excluir este usuário. Verifique se ele está logado ou vinculado ao sistema."
            });

        } catch (erro) {
            console.log("ERRO AO EXCLUIR USUÁRIO:", erro);

            return res.send({
                ok: false,
                msg: "Erro interno ao excluir usuário."
            });
        }
    }
}

module.exports = UsuarioController;