const Database = require("../utils/database");

class CategoriaModel {

    #catId;
    #catDescricao;
    #catAtivo;

    constructor(catId, catDescricao, catAtivo) {
        this.#catId = catId;
        this.#catDescricao = catDescricao;
        this.#catAtivo = catAtivo;
    }

    get catId() { return this.#catId; }
    set catId(value) { this.#catId = value; }

    get catDescricao() { return this.#catDescricao; }
    set catDescricao(value) { this.#catDescricao = value; }

    get catAtivo() { return this.#catAtivo; }
    set catAtivo(value) { this.#catAtivo = value; }

    async listar() {
        let sql = "select * from tb_categoria order by cat_id";

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql);

        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            lista.push(new CategoriaModel(
                rows[i]["cat_id"],
                rows[i]["cat_descricao"],
                rows[i]["cat_ativo"]
            ));
        }

        return lista;
    }

    async obter(id) {
        let sql = "select * from tb_categoria where cat_id = ?";

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [id]);

        if (rows.length > 0) {
            return new CategoriaModel(
                rows[0]["cat_id"],
                rows[0]["cat_descricao"],
                rows[0]["cat_ativo"]
            );
        }

        return null;
    }

    async cadastrar() {
        let sql = `
            insert into tb_categoria
            (cat_descricao, cat_ativo)
            values (?, ?)
        `;

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, [
            this.#catDescricao,
            this.#catAtivo
        ]);
    }

    async atualizar() {
        let sql = `
            update tb_categoria
            set cat_descricao = ?, cat_ativo = ?
            where cat_id = ?
        `;

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, [
            this.#catDescricao,
            this.#catAtivo,
            this.#catId
        ]);
    }

    async estaEmUso(id) {
        let sql = `
            select count(*) as total
            from tb_produto
            where cat_id = ?
        `;

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [id]);

        return rows[0].total > 0;
    }

    async deletar(id) {
        if (await this.estaEmUso(id)) {
            return false;
        }

        let sql = "delete from tb_categoria where cat_id = ?";

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, [id]);
    }
}

module.exports = CategoriaModel;