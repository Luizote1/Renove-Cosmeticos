const Database = require("../utils/database");

class PedidoItemModel {

    #pedidoItemId;
    #pedidoId;
    #produtoCodigo;
    #pedidoItemQuantidade;
    #pedidoItemValor;
    #pedidoItemValorTotal;
    #produtoNome;
    #pedidoValorTotal;
    #pedidoData;
    #pedidoStatus;
    #pedidoPagamento;

    constructor(
        pedidoItemId,
        pedidoId,
        produtoCodigo,
        pedidoItemQuantidade,
        pedidoItemValor,
        pedidoItemValorTotal,
        produtoNome,
        pedidoValorTotal,
        pedidoData,
        pedidoStatus,
        pedidoPagamento
    ) {
        this.#pedidoItemId = pedidoItemId;
        this.#pedidoId = pedidoId;
        this.#produtoCodigo = produtoCodigo;
        this.#pedidoItemQuantidade = pedidoItemQuantidade;
        this.#pedidoItemValor = pedidoItemValor;
        this.#pedidoItemValorTotal = pedidoItemValorTotal;
        this.#produtoNome = produtoNome;
        this.#pedidoValorTotal = pedidoValorTotal;
        this.#pedidoData = pedidoData;
        this.#pedidoStatus = pedidoStatus;
        this.#pedidoPagamento = pedidoPagamento;
    }

    get pedidoItemId() { return this.#pedidoItemId; }
    set pedidoItemId(value) { this.#pedidoItemId = value; }

    get pedidoId() { return this.#pedidoId; }
    set pedidoId(value) { this.#pedidoId = value; }

    get produtoCodigo() { return this.#produtoCodigo; }
    set produtoCodigo(value) { this.#produtoCodigo = value; }

    get pedidoItemQuantidade() { return this.#pedidoItemQuantidade; }
    set pedidoItemQuantidade(value) { this.#pedidoItemQuantidade = value; }

    get pedidoItemValor() { return this.#pedidoItemValor; }
    set pedidoItemValor(value) { this.#pedidoItemValor = value; }

    get pedidoItemValorTotal() { return this.#pedidoItemValorTotal; }
    set pedidoItemValorTotal(value) { this.#pedidoItemValorTotal = value; }

    async gravar() {
        let sql = `
            INSERT INTO tb_pedidoitens
            (ped_id, pro_codigo, pit_quantidade, pit_valorunidade, pit_valortotal)
            VALUES (?, ?, ?, ?, ?)
        `;

        let valores = [
            this.#pedidoId,
            this.#produtoCodigo,
            this.#pedidoItemQuantidade,
            this.#pedidoItemValor,
            this.#pedidoItemValorTotal
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
            this.#pedidoItemQuantidade,
            this.#produtoCodigo,
            this.#pedidoItemQuantidade
        ];

        let banco = new Database();
        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async listarPedidosItens(parametro) {
        let sqlWhere = "";
        let valores = [];

        if (parametro) {
            if (isNaN(parametro)) {
                sqlWhere = " WHERE pr.pro_nome LIKE ? ";
                valores.push("%" + parametro + "%");
            } else {
                sqlWhere = " WHERE p.ped_id = ? ";
                valores.push(parametro);
            }
        }

        let sql = `
            SELECT 
                p.ped_id,
                p.ped_data,
                p.ped_valortotal,
                p.ped_pagamento,
                p.ped_status,
                pr.pro_nome,
                i.pit_quantidade,
                i.pit_valorunidade,
                i.pit_valortotal
            FROM tb_pedido p
            INNER JOIN tb_pedidoitens i ON p.ped_id = i.ped_id
            INNER JOIN tb_produto pr ON i.pro_codigo = pr.pro_codigo
            ${sqlWhere}
            ORDER BY p.ped_id DESC
        `;

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, valores);

        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            lista.push(new PedidoItemModel(
                0,
                rows[i]["ped_id"],
                "",
                rows[i]["pit_quantidade"],
                rows[i]["pit_valorunidade"],
                rows[i]["pit_valortotal"],
                rows[i]["pro_nome"],
                rows[i]["ped_valortotal"],
                rows[i]["ped_data"],
                rows[i]["ped_status"],
                rows[i]["ped_pagamento"]
            ));
        }

        return lista;
    }

    async listarPedidosCliente(cliId) {
        let sql = `
            SELECT 
                p.ped_id,
                p.ped_data,
                p.ped_valortotal,
                p.ped_pagamento,
                p.ped_status,
                pr.pro_nome,
                i.pit_quantidade,
                i.pit_valorunidade,
                i.pit_valortotal
            FROM tb_pedido p
            INNER JOIN tb_pedidoitens i ON p.ped_id = i.ped_id
            INNER JOIN tb_produto pr ON i.pro_codigo = pr.pro_codigo
            WHERE p.cli_id = ?
            ORDER BY p.ped_id DESC
        `;

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [cliId]);

        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            lista.push(new PedidoItemModel(
                0,
                rows[i]["ped_id"],
                "",
                rows[i]["pit_quantidade"],
                rows[i]["pit_valorunidade"],
                rows[i]["pit_valortotal"],
                rows[i]["pro_nome"],
                rows[i]["ped_valortotal"],
                rows[i]["ped_data"],
                rows[i]["ped_status"],
                rows[i]["ped_pagamento"]
            ));
        }

        return lista;
    }

    toJSON() {
        return {
            pedidoId: this.#pedidoId,
            pedidoData: this.#pedidoData,
            pedidoValor: this.#pedidoValorTotal,
            pedidoStatus: this.#pedidoStatus,
            pedidoPagamento: this.#pedidoPagamento,
            itemQuantidade: this.#pedidoItemQuantidade,
            itemValor: this.#pedidoItemValor,
            itemValorTotal: this.#pedidoItemValorTotal,
            itemNome: this.#produtoNome
        };
    }
}

module.exports = PedidoItemModel;