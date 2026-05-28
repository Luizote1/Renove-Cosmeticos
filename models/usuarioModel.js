const Database = require("../utils/database");

class UsuarioModel {

    #usuId;
    #usuNome;
    #usuEmail;
    #usuSenha;
    #usuAtivo;
    #perfilId;
    #perfilDescricao;

    get usuId() { return this.#usuId; }
    set usuId(value) { this.#usuId = value; }

    get usuNome() { return this.#usuNome; }
    set usuNome(value) { this.#usuNome = value; }

    get usuEmail() { return this.#usuEmail; }
    set usuEmail(value) { this.#usuEmail = value; }

    get usuSenha() { return this.#usuSenha; }
    set usuSenha(value) { this.#usuSenha = value; }

    get usuAtivo() { return this.#usuAtivo; }
    set usuAtivo(value) { this.#usuAtivo = value; }

    get perfilId() { return this.#perfilId; }
    set perfilId(value) { this.#perfilId = value; }

    get perfilDescricao() { return this.#perfilDescricao; }
    set perfilDescricao(value) { this.#perfilDescricao = value; }

    constructor(
        usuId,
        usuNome,
        usuEmail,
        usuSenha,
        usuAtivo,
        perfilId,
        perfilDescricao = ""
    ) {
        this.#usuId = usuId;
        this.#usuNome = usuNome;
        this.#usuEmail = usuEmail;
        this.#usuSenha = usuSenha;
        this.#usuAtivo = usuAtivo;
        this.#perfilId = perfilId;
        this.#perfilDescricao = perfilDescricao;
    }

    async cadastrar() {

        let sql = `
            INSERT INTO tb_usuario
            (
                usu_nome,
                usu_email,
                usu_senha,
                usu_ativo,
                per_id
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, [
            this.#usuNome,
            this.#usuEmail,
            this.#usuSenha,
            this.#usuAtivo,
            this.#perfilId
        ]);
    }

    async obter(id) {

        let sql = `
            SELECT
                u.*,
                p.per_descricao
            FROM tb_usuario u
            INNER JOIN tb_perfil p
                ON u.per_id = p.per_id
            WHERE u.usu_id = ?
        `;

        let banco = new Database();

        let rows = await banco.ExecutaComando(sql, [id]);

        if (rows.length > 0) {

            return new UsuarioModel(
                rows[0]["usu_id"],
                rows[0]["usu_nome"],
                rows[0]["usu_email"],
                rows[0]["usu_senha"],
                rows[0]["usu_ativo"],
                rows[0]["per_id"],
                rows[0]["per_descricao"]
            );
        }

        return null;
    }

    async atualizar() {

        let sql = `
            UPDATE tb_usuario
            SET
                usu_nome = ?,
                usu_email = ?,
                usu_senha = ?,
                usu_ativo = ?,
                per_id = ?
            WHERE usu_id = ?
        `;

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, [
            this.#usuNome,
            this.#usuEmail,
            this.#usuSenha,
            this.#usuAtivo,
            this.#perfilId,
            this.#usuId
        ]);
    }

    async deletar(id, usuarioLogadoId = null) {

        if (
            usuarioLogadoId &&
            Number(id) === Number(usuarioLogadoId)
        ) {
            return false;
        }

        let sql = `
            DELETE FROM tb_usuario
            WHERE usu_id = ?
        `;

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, [id]);
    }

    async listar() {

        let sql = `
            SELECT
                u.*,
                p.per_descricao
            FROM tb_usuario u
            INNER JOIN tb_perfil p
                ON u.per_id = p.per_id
            ORDER BY u.usu_id
        `;

        let banco = new Database();

        let rows = await banco.ExecutaComando(sql);

        let lista = [];

        for(let i = 0; i < rows.length; i++) {

            lista.push(
                new UsuarioModel(
                    rows[i]["usu_id"],
                    rows[i]["usu_nome"],
                    rows[i]["usu_email"],
                    rows[i]["usu_senha"],
                    rows[i]["usu_ativo"],
                    rows[i]["per_id"],
                    rows[i]["per_descricao"]
                )
            );
        }

        return lista;
    }

    async autenticar(email, senha) {

        let sql = `
            SELECT
                u.*,
                p.per_descricao
            FROM tb_usuario u
            INNER JOIN tb_perfil p
                ON u.per_id = p.per_id
            WHERE
                u.usu_email = ?
                AND u.usu_senha = ?
                AND u.usu_ativo = 's'
            LIMIT 1
        `;

        let banco = new Database();

        let rows = await banco.ExecutaComando(sql, [
            email,
            senha
        ]);

        if (rows.length > 0) {

            return new UsuarioModel(
                rows[0]["usu_id"],
                rows[0]["usu_nome"],
                rows[0]["usu_email"],
                rows[0]["usu_senha"],
                rows[0]["usu_ativo"],
                rows[0]["per_id"],
                rows[0]["per_descricao"]
            );
        }

        return null;
    }

    async listarFuncionarios() {

        let sql = `
            SELECT
                u.*,
                p.per_descricao
            FROM tb_usuario u
            INNER JOIN tb_perfil p
                ON u.per_id = p.per_id
            WHERE
                u.per_id = 2
                AND u.usu_ativo = 's'
            ORDER BY u.usu_nome
        `;

        let banco = new Database();

        let rows = await banco.ExecutaComando(sql);

        let lista = [];

        for(let i = 0; i < rows.length; i++) {

            lista.push(
                new UsuarioModel(
                    rows[i]["usu_id"],
                    rows[i]["usu_nome"],
                    rows[i]["usu_email"],
                    rows[i]["usu_senha"],
                    rows[i]["usu_ativo"],
                    rows[i]["per_id"],
                    rows[i]["per_descricao"]
                )
            );
        }

        return lista;
    }

    async isAdministrador(id) {

        let usuario = await this.obter(id);

        if(!usuario){
            return false;
        }

        return Number(usuario.perfilId) === 1;
    }

    async isFuncionario(id) {

        let usuario = await this.obter(id);

        if(!usuario){
            return false;
        }

        return Number(usuario.perfilId) === 2;
    }
}

module.exports = UsuarioModel;