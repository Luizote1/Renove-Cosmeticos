const PerfilModel = require("../models/perfilModel");
const UsuarioModel = require("../models/usuarioModel");

class UsuarioController {
    async listarView(req, res) {
        let usuario = new UsuarioModel();
        let lista = await usuario.listar();

        res.render("usuario/listar", { lista, layout: "layout" });
    }

    async cadastrarView(req, res) {
        let perfil = new PerfilModel();
        let listaPerfil = await perfil.listar();

        res.render("usuario/cadastrar", { listaPerfil, layout: "layout" });
    }

    async alterarView(req, res) {
        let perfil = new PerfilModel();
        let listaPerfil = await perfil.listar();

        let usuario = new UsuarioModel();
        usuario = await usuario.obter(req.params.idAlteracao);

        res.render("usuario/alterar", { listaPerfil, usuario, layout: "layout" });
    }

    async cadastrar(req, res) {
        let ok = false;
        let msg = "";

        if (req.body.nome != "" && req.body.email != "" && req.body.senha != "" && req.body.perfil != "0") {
            let usuario = new UsuarioModel(
                0,
                req.body.nome,
                req.body.email,
                req.body.senha,
                req.body.ativo == true ? 's' : 'n',
                req.body.perfil
            );

            let result = await usuario.cadastrar();

            if (result) {
                ok = true;
                msg = "Usuário cadastrado!";
            } else {
                msg = "Erro ao inserir usuário no banco de dados!";
            }
        } else {
            msg = "Erro durante a validação das informações do usuário!";
        }

        res.send({ ok, msg });
    }

    async alterar(req, res) {
        let ok = false;
        let msg = "";

        if (req.body.id != "0" && req.body.nome != "" && req.body.email != "" && req.body.senha != "" && req.body.perfil != "0") {
            let usuario = new UsuarioModel(
                req.body.id,
                req.body.nome,
                req.body.email,
                req.body.senha,
                req.body.ativo == true ? "s" : "n",
                req.body.perfil
            );

            let result = await usuario.atualizar();

            if (result) {
                ok = true;
                msg = "Usuário alterado!";
            } else {
                msg = "Erro ao alterar usuário no banco de dados";
            }
        } else {
            msg = "Erro ao validar as informações do usuário!";
        }

        res.send({ ok, msg });
    }

    async deletar(req, res) {
        let ok = false;
        let msg = "";

        if (req.body.id && req.body.id != "0") {
            let usuario = new UsuarioModel();
            let result = await usuario.deletar(req.body.id);

            if (result) {
                ok = true;
                msg = "Usuário excluído!";
            } else {
                msg = "Erro ao excluir usuário no banco de dados!";
            }
        } else {
            msg = "ID não informado para exclusão!";
        }

        res.send({ ok, msg });
    }
}

module.exports = UsuarioController;