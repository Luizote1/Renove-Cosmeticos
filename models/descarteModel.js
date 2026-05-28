const Database = require("../utils/database");

class DescarteModel {

    #desId;
    #proCodigo;
    #desQuantidade;
    #desData;
    #desMotivo;
    #desObservacao;

    get desId() { return this.#desId; }
    set desId(value) { this.#desId = value; }

    get proCodigo() { return this.#proCodigo; }
    set proCodigo(value) { this.#proCodigo = value; }

    get desQuantidade() { return this.#desQuantidade; }
    set desQuantidade(value) { this.#desQuantidade = value; }

    get desData() { return this.#desData; }
    set desData(value) { this.#desData = value; }

    get desMotivo() { return this.#desMotivo; }
    set desMotivo(value) { this.#desMotivo = value; }

    get desObservacao() { return this.#desObservacao; }
    set desObservacao(value) { this.#desObservacao = value; }

    constructor(desId, proCodigo, desQuantidade, desData, desMotivo, desObservacao) {
        this.#desId = desId;
        this.#proCodigo = proCodigo;
        this.#desQuantidade = desQuantidade;
        this.#desData = desData;
        this.#desMotivo = desMotivo;
        this.#desObservacao = desObservacao;
    }

    async listar() {
        let sql = `
            SELECT 
                d.*,
                p.pro_nome
            FROM tb_descarte d
            INNER JOIN tb_produto p 
                ON d.pro_codigo = p.pro_codigo
            ORDER BY d.des_data DESC
        `;

        let banco = new Database();

        return await banco.ExecutaComando(sql);
    }

    async obter(id) {
        let sql = `
            SELECT *
            FROM tb_descarte
            WHERE des_id = ?
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
            INSERT INTO tb_descarte
            (
                pro_codigo,
                des_quantidade,
                des_data,
                des_motivo,
                des_observacao
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        let valores = [
            this.#proCodigo,
            this.#desQuantidade,
            this.#desData,
            this.#desMotivo,
            this.#desObservacao
        ];

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async atualizar() {
        let sql = `
            UPDATE tb_descarte
            SET
                pro_codigo = ?,
                des_quantidade = ?,
                des_data = ?,
                des_motivo = ?,
                des_observacao = ?
            WHERE des_id = ?
        `;

        let valores = [
            this.#proCodigo,
            this.#desQuantidade,
            this.#desData,
            this.#desMotivo,
            this.#desObservacao,
            this.#desId
        ];

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async baixarEstoque() {
        let sql = `
            UPDATE tb_produto
            SET pro_estoque = pro_estoque - ?
            WHERE pro_codigo = ?
              AND pro_estoque >= ?
        `;

        let valores = [
            this.#desQuantidade,
            this.#proCodigo,
            this.#desQuantidade
        ];

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async devolverEstoque(qtd, codigoProduto) {
        let sql = `
            UPDATE tb_produto
            SET pro_estoque = pro_estoque + ?
            WHERE pro_codigo = ?
        `;

        let valores = [
            qtd,
            codigoProduto
        ];

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async deletar(id) {
        return false;
    }
}

module.exports = DescarteModel;