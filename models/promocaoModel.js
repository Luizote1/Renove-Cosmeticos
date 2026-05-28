const Database = require("../utils/database");

class PromocaoModel {

    #promId;
    #proCodigo;
    #promDesconto;
    #promDataInicio;
    #promDataFim;
    #promAtivo;

    get promId() { return this.#promId; }
    set promId(value) { this.#promId = value; }

    get proCodigo() { return this.#proCodigo; }
    set proCodigo(value) { this.#proCodigo = value; }

    get promDesconto() { return this.#promDesconto; }
    set promDesconto(value) { this.#promDesconto = value; }

    get promDataInicio() { return this.#promDataInicio; }
    set promDataInicio(value) { this.#promDataInicio = value; }

    get promDataFim() { return this.#promDataFim; }
    set promDataFim(value) { this.#promDataFim = value; }

    get promAtivo() { return this.#promAtivo; }
    set promAtivo(value) { this.#promAtivo = value; }

    constructor(promId, proCodigo, promDesconto, promDataInicio, promDataFim, promAtivo) {
        this.#promId = promId;
        this.#proCodigo = proCodigo;
        this.#promDesconto = promDesconto;
        this.#promDataInicio = promDataInicio;
        this.#promDataFim = promDataFim;
        this.#promAtivo = promAtivo;
    }

    async listar() {
        let sql = `
            SELECT 
                pr.*,
                p.pro_nome,
                p.pro_preco,
                p.pro_data_validade
            FROM tb_promocao pr
            INNER JOIN tb_produto p ON pr.pro_codigo = p.pro_codigo
            ORDER BY pr.prom_data_fim ASC
        `;

        let banco = new Database();
        return await banco.ExecutaComando(sql);
    }

    async obter(id) {
        let sql = "SELECT * FROM tb_promocao WHERE prom_id = ?";
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [id]);

        if (rows.length > 0) {
            return rows[0];
        }

        return null;
    }

    async cadastrar() {
        let sql = `
            INSERT INTO tb_promocao
            (pro_codigo, prom_desconto, prom_data_inicio, prom_data_fim, prom_ativo)
            VALUES (?, ?, ?, ?, ?)
        `;

        let valores = [
            this.#proCodigo,
            this.#promDesconto,
            this.#promDataInicio,
            this.#promDataFim,
            this.#promAtivo
        ];

        let banco = new Database();
        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async atualizar() {
        let sql = `
            UPDATE tb_promocao
            SET pro_codigo = ?,
                prom_desconto = ?,
                prom_data_inicio = ?,
                prom_data_fim = ?,
                prom_ativo = ?
            WHERE prom_id = ?
        `;

        let valores = [
            this.#proCodigo,
            this.#promDesconto,
            this.#promDataInicio,
            this.#promDataFim,
            this.#promAtivo,
            this.#promId
        ];

        let banco = new Database();
        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async estaAtiva(id) {
        let sql = `
        select count(*) as total
        from tb_promocao
        where prom_id = ?
          and prom_ativo = 's'
          and curdate() between prom_data_inicio and prom_data_fim
    `;

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [id]);

        return rows[0].total > 0;
    }

    async deletar(id) {
        if (await this.estaAtiva(id)) {
            return false;
        }

        let sql = "DELETE FROM tb_promocao WHERE prom_id = ?";
        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, [id]);
    }

    async listarProdutosProximosVencimento() {
        let sql = `
            SELECT 
                pro_codigo,
                pro_nome,
                pro_preco,
                pro_estoque,
                pro_data_validade
            FROM tb_produto
            WHERE pro_data_validade IS NOT NULL
              AND pro_data_validade <= DATE_ADD(CURDATE(), INTERVAL 60 DAY)
              AND pro_ativo = 's'
            ORDER BY pro_data_validade ASC
        `;

        let banco = new Database();
        return await banco.ExecutaComando(sql);
    }
}

module.exports = PromocaoModel;