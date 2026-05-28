const PerfilModel = require("../models/perfilModel");
const UsuarioModel = require("../models/usuarioModel");

class UsuarioController {

    async usuarioLogado(req) {
        let usuarioModel = new UsuarioModel();
        return await usuarioModel.obter(req.cookies.usuarioLogado);
    }

    isAdministrador(usuario) {
        return usuario && Number(usuario.perfilId) === 1;
    }

    isFuncionario(usuario) {
        return usuario && Number(usuario.perfilId) === 2;
    }

    async listarView(req, res) {
        try {
            let usuarioModel = new UsuarioModel();
            let lista = await usuarioModel.listar();

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
            let logado = await this.usuarioLogado(req);

            if (!this.isAdministrador(logado)) {
                return res.redirect("/usuario");
            }

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
            let logado = await this.usuarioLogado(req);

            let perfil = new PerfilModel();
            let listaPerfil = await perfil.listar();

            let usuarioModel = new UsuarioModel();
            let usuario = await usuarioModel.obter(req.params.idAlteracao);

            if (!usuario) {
                return res.redirect("/usuario");
            }

            if (!this.isAdministrador(logado) && Number(usuario.perfilId) === 1) {
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
            let logado = await this.usuarioLogado(req);

            if (!this.isAdministrador(logado)) {
                return res.send({
                    ok: false,
                    msg: "Apenas administradores podem cadastrar usuários."
                });
            }

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
            let logado = await this.usuarioLogado(req);

            let usuarioModel = new UsuarioModel();
            let usuarioAlvo = await usuarioModel.obter(req.body.id);

            if (!usuarioAlvo) {
                return res.send({
                    ok: false,
                    msg: "Usuário não encontrado."
                });
            }

            if (!this.isAdministrador(logado) && Number(usuarioAlvo.perfilId) === 1) {
                return res.send({
                    ok: false,
                    msg: "Funcionários não podem alterar administradores."
                });
            }

            if (!this.isAdministrador(logado) && Number(req.body.perfil) === 1) {
                return res.send({
                    ok: false,
                    msg: "Funcionários não podem transformar usuários em administradores."
                });
            }

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

            let idExcluir = req.body.id;
            let usuarioLogado = req.usuarioLogado;

            if (!idExcluir) {
                return res.send({
                    ok: false,
                    msg: "ID do usuário não informado."
                });
            }

            let usuarioModel = new UsuarioModel();

            let usuarioExcluir = await usuarioModel.obter(idExcluir);

            if (!usuarioExcluir) {
                return res.send({
                    ok: false,
                    msg: "Usuário não encontrado."
                });
            }

            // não pode excluir si mesmo
            if (
                Number(usuarioLogado.usuId) === Number(idExcluir)
            ) {
                return res.send({
                    ok: false,
                    msg: "Você não pode excluir o usuário logado."
                });
            }

            // funcionário tentando excluir admin
            if (
                Number(usuarioLogado.perfilId) === 2 &&
                Number(usuarioExcluir.perfilId) === 1
            ) {
                return res.send({
                    ok: false,
                    msg: "Funcionário não pode excluir administrador."
                });
            }

            let ok = await usuarioModel.deletar(idExcluir);

            return res.send({
                ok: ok,
                msg: ok
                    ? "Usuário excluído com sucesso!"
                    : "Erro ao excluir usuário."
            });

        }
        catch (erro) {

            console.log(erro);

            return res.send({
                ok: false,
                msg: "Erro interno ao excluir usuário."
            });
        }
    }
}

module.exports = UsuarioController;