const Database = require("../utils/database");

class RecebimentoModel {

    #recId;
    #proCodigo;
    #recQuantidade;
    #recData;
    #recLote;
    #recValidade;
    #recObservacao;

    get recId() { return this.#recId; }
    set recId(value) { this.#recId = value; }

    get proCodigo() { return this.#proCodigo; }
    set proCodigo(value) { this.#proCodigo = value; }

    get recQuantidade() { return this.#recQuantidade; }
    set recQuantidade(value) { this.#recQuantidade = value; }

    get recData() { return this.#recData; }
    set recData(value) { this.#recData = value; }

    get recLote() { return this.#recLote; }
    set recLote(value) { this.#recLote = value; }

    get recValidade() { return this.#recValidade; }
    set recValidade(value) { this.#recValidade = value; }

    get recObservacao() { return this.#recObservacao; }
    set recObservacao(value) { this.#recObservacao = value; }

    constructor(recId, proCodigo, recQuantidade, recData, recLote, recValidade, recObservacao) {
        this.#recId = recId;
        this.#proCodigo = proCodigo;
        this.#recQuantidade = recQuantidade;
        this.#recData = recData;
        this.#recLote = recLote;
        this.#recValidade = recValidade;
        this.#recObservacao = recObservacao;
    }

    async listar() {
        let sql = `
            SELECT 
                r.*,
                p.pro_nome
            FROM tb_recebimento r
            INNER JOIN tb_produto p ON r.pro_codigo = p.pro_codigo
            ORDER BY r.rec_data DESC
        `;

        let banco = new Database();

        return await banco.ExecutaComando(sql);
    }

    async obter(id) {
        let sql = `
            SELECT *
            FROM tb_recebimento
            WHERE rec_id = ?
        `;

        let banco = new Database();

        let rows = await banco.ExecutaComando(sql, [id]);

        if (rows.length > 0) {
            return rows[0];
        }

        return null;
    }

    async cadastrar() {
        let sql = `
            INSERT INTO tb_recebimento
            (
                pro_codigo,
                rec_quantidade,
                rec_data,
                rec_lote,
                rec_validade,
                rec_observacao
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        let valores = [
            this.#proCodigo,
            this.#recQuantidade,
            this.#recData,
            this.#recLote,
            this.#recValidade,
            this.#recObservacao
        ];

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async atualizar() {
        let sql = `
            UPDATE tb_recebimento
            SET
                pro_codigo = ?,
                rec_quantidade = ?,
                rec_data = ?,
                rec_lote = ?,
                rec_validade = ?,
                rec_observacao = ?
            WHERE rec_id = ?
        `;

        let valores = [
            this.#proCodigo,
            this.#recQuantidade,
            this.#recData,
            this.#recLote,
            this.#recValidade,
            this.#recObservacao,
            this.#recId
        ];

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async atualizarEstoque() {
        let sql = `
            UPDATE tb_produto
            SET pro_estoque = pro_estoque + ?
            WHERE pro_codigo = ?
        `;

        let valores = [
            this.#recQuantidade,
            this.#proCodigo
        ];

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async estaEmUso(id) {
        let sql = `
            SELECT COUNT(*) AS total
            FROM tb_recebimento
            WHERE rec_id = ?
        `;

        let banco = new Database();

        let rows = await banco.ExecutaComando(sql, [id]);

        return rows[0].total > 0;
    }

    async deletar(id) {
        return false;
    }
}

module.exports = RecebimentoModel;