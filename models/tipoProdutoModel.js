const Database = require("../utils/database");

class TipoProdutoModel {

    #tipId;
    #tipDescricao;
    #tipAtivo;

    constructor(tipId, tipDescricao, tipAtivo) {
        this.#tipId = tipId;
        this.#tipDescricao = tipDescricao;
        this.#tipAtivo = tipAtivo;
    }

    get tipId() { return this.#tipId; }
    set tipId(value) { this.#tipId = value; }

    get tipDescricao() { return this.#tipDescricao; }
    set tipDescricao(value) { this.#tipDescricao = value; }

    get tipAtivo() { return this.#tipAtivo; }
    set tipAtivo(value) { this.#tipAtivo = value; }

    async listar() {
        let sql = "select * from tb_tipo_produto order by tip_id";

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql);

        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            lista.push(new TipoProdutoModel(
                rows[i]["tip_id"],
                rows[i]["tip_descricao"],
                rows[i]["tip_ativo"]
            ));
        }

        return lista;
    }

    async obter(id) {
        let sql = "select * from tb_tipo_produto where tip_id = ?";

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [id]);

        if (rows.length > 0) {
            return new TipoProdutoModel(
                rows[0]["tip_id"],
                rows[0]["tip_descricao"],
                rows[0]["tip_ativo"]
            );
        }

        return null;
    }

    async cadastrar() {
        let sql = `
            insert into tb_tipo_produto
            (tip_descricao, tip_ativo)
            values (?, ?)
        `;

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, [
            this.#tipDescricao,
            this.#tipAtivo
        ]);
    }

    async atualizar() {
        let sql = `
            update tb_tipo_produto
            set tip_descricao = ?, tip_ativo = ?
            where tip_id = ?
        `;

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, [
            this.#tipDescricao,
            this.#tipAtivo,
            this.#tipId
        ]);
    }

    async estaEmUso(id) {
        let sql = `
            select count(*) as total
            from tb_produto
            where tip_id = ?
        `;

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [id]);

        return rows[0].total > 0;
    }

    async deletar(id) {
        if (await this.estaEmUso(id)) {
            return false;
        }

        let sql = "delete from tb_tipo_produto where tip_id = ?";

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, [id]);
    }
}

module.exports = TipoProdutoModel;