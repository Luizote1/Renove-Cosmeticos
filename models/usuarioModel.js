const Database = require("../utils/database");

class UsuarioModel {
    //atributos que representam a entidade no banco
    #usuId;
    #usuNome;
    #usuEmail;
    #usuSenha;
    #usuAtivo;
    #perfilId;

    get usuId() {
        return this.#usuId;
    }

    set usuId(value) {
        this.#usuId = value;
    }

    get usuNome() {
        return this.#usuNome;
    }

    set usuNome(value) {
        this.#usuNome = value;
    }

    get usuEmail() {
        return this.#usuEmail;
    }

    set usuEmail(value) {
        this.#usuEmail = value;
    }

    get usuSenha() {
        return this.#usuSenha;
    }

    set usuSenha(value) {
        this.#usuSenha = value;
    }

    get usuAtivo() {
        return this.#usuAtivo
    }

    set usuAtivo(value) {
        this.#usuAtivo = value;
    }

    get perfilId() {
        return this.#perfilId;
    }

    set perfilId(value) {
        this.#perfilId = value;
    }

    constructor(usuId, usuNome, usuEmail, usuSenha, usuAtivo, perfilId) {
        this.#usuId = usuId;
        this.#usuNome = usuNome;
        this.#usuEmail = usuEmail;
        this.#usuSenha = usuSenha;
        this.#usuAtivo = usuAtivo;
        this.#perfilId = perfilId;
    }


    async cadastrar() {
        let sql = "insert into tb_usuario (usu_nome,usu_email, usu_senha, usu_ativo, per_id) values (?,?,?,?,?)"

        let valores = [this.#usuNome, this.#usuEmail, this.#usuSenha, this.#usuAtivo, this.#perfilId];

        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, valores)

        return result;
    }

    async obter(id) {
        let sql = "select * from tb_usuario where usu_id = ?";
        let valores = [id];

        let banco = new Database();

        let rows = await banco.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            //mapeamento banco -> model
            let usuario = new UsuarioModel(rows[0]["usu_id"], rows[0]["usu_nome"], rows[0]["usu_email"], rows[0]["usu_senha"], rows[0]["usu_ativo"], rows[0]["per_id"]);

            return usuario;
        }

        return null;
    }

    async atualizar() {
        let sql = "update tb_usuario set usu_nome = ?, usu_email = ?, usu_senha = ?, usu_ativo = ?, per_id = ? where usu_id = ?";

        let valores = [this.#usuNome, this.#usuEmail, this.#usuSenha, this.#usuAtivo, this.#perfilId, this.#usuId];
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    async deletar(id, usuarioLogadoId = null) {

        if (usuarioLogadoId && Number(id) === Number(usuarioLogadoId)) {
            return false;
        }

        let sql = "delete from tb_usuario where usu_id = ?";
        let valores = [id];

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async listar() {
        let sql = "select * from tb_usuario";

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql);
        let lista = [];
        for (let i = 0; i < rows.length; i++) {
            //mapeamento banco -> modelo
            let usuario = new UsuarioModel(rows[i]["usu_id"], rows[i]["usu_nome"], rows[i]["usu_email"], rows[i]["usu_senha"], rows[i]["usu_ativo"], rows[i]["per_id"]);
            lista.push(usuario);
        }
        return lista;
    }

    async autenticar(email, senha) {
        let sql = `
        select * 
        from tb_usuario
        where usu_email = ?
          and usu_senha = ?
          and usu_ativo = 's'
        limit 1
    `;

        let valores = [email, senha];

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            let row = rows[0];

            return new UsuarioModel(
                row["usu_id"],
                row["usu_nome"],
                row["usu_email"],
                row["usu_senha"],
                row["usu_ativo"],
                row["per_id"]
            );
        }

        return null;
    }
}

module.exports = UsuarioModel;