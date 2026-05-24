const Database = require("../utils/database");

class PerfilModel {
    #perfilId;
    #perfilDescricao;

    get perfilId() {
        return this.#perfilId;
    }

    set perfilId(value) {
        this.#perfilId = value;
    }

    get perfilDescricao() {
        return this.#perfilDescricao;
    }

    set perfilDescricao(value) {
        this.#perfilDescricao = value;
    }

    constructor(perfilId, perfilDescricao) {
        this.#perfilId = perfilId;
        this.#perfilDescricao = perfilDescricao;
    }

    async cadastrar() {
        let sql = "insert into tb_perfil (per_descricao) values (?)";
        let valores = [this.#perfilDescricao];

        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async obter(id) {
        let sql = "select * from tb_perfil where per_id = ?";
        let valores = [id];

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            let perfil = new PerfilModel(rows[0]["per_id"], rows[0]["per_descricao"]);
            return perfil;
        }

        return null;
    }

    async atualizar() {
        let sql = "update tb_perfil set per_descricao = ? where per_id = ?";
        let valores = [this.#perfilDescricao, this.#perfilId];

        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async deletar(id) {
        let sql = "delete from tb_perfil where per_id = ?";
        let valores = [id];

        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async listar() {
        let sql = "select * from tb_perfil";

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql);

        let lista = [];
        for (let i = 0; i < rows.length; i++) {
            let perfil = new PerfilModel(rows[i]["per_id"], rows[i]["per_descricao"]);
            lista.push(perfil);
        }

        return lista;
    }
}

module.exports = PerfilModel;