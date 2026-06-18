const Database = require("../utils/database");

class DevolucaoModel {

    #devId;
    #pedId;
    #cliId;
    #proCodigo;
    #devQuantidade;
    #devMotivo;
    #devData;
    #devObservacao;

    constructor(
        devId,
        pedId,
        cliId,
        proCodigo,
        devQuantidade,
        devMotivo,
        devData,
        devObservacao
    ) {
        this.#devId = devId;
        this.#pedId = pedId;
        this.#cliId = cliId;
        this.#proCodigo = proCodigo;
        this.#devQuantidade = devQuantidade;
        this.#devMotivo = devMotivo;
        this.#devData = devData;
        this.#devObservacao = devObservacao;
    }

    async listar() {
        let sql = `
            SELECT 
                d.*,
                c.cli_nome,
                p.pro_nome
            FROM tb_devolucao d
            INNER JOIN tb_cliente c ON d.cli_id = c.cli_id
            INNER JOIN tb_produto p ON d.pro_codigo = p.pro_codigo
            ORDER BY d.dev_data DESC
        `;

        let banco = new Database();

        return await banco.ExecutaComando(sql);
    }

    async listarPedidos() {
        let sql = `
        SELECT 
            p.ped_id,
            p.cli_id,
            p.ped_data,
            p.ped_valortotal,
            p.ped_pagamento,
            p.ped_status,
            c.cli_nome
        FROM tb_pedido p
        INNER JOIN tb_cliente c
            ON p.cli_id = c.cli_id
        ORDER BY p.ped_id DESC
    `;

        let banco = new Database();

        return await banco.ExecutaComando(sql);
    }

    async listarItensPedido(pedId) {
        let sql = `
            SELECT
                i.*,
                p.pro_nome
            FROM tb_pedidoitens i
            INNER JOIN tb_produto p ON i.pro_codigo = p.pro_codigo
            WHERE i.ped_id = ?
        `;

        let banco = new Database();

        return await banco.ExecutaComando(sql, [pedId]);
    }

    async obterPedido(pedId) {
        let sql = `
            SELECT *
            FROM tb_pedido
            WHERE ped_id = ?
        `;

        let banco = new Database();

        let rows = await banco.ExecutaComando(sql, [pedId]);

        if (rows.length > 0) {
            return rows[0];
        }

        return null;
    }

    async cadastrar() {
        let sql = `
            INSERT INTO tb_devolucao
            (
                ped_id,
                cli_id,
                pro_codigo,
                dev_quantidade,
                dev_motivo,
                dev_data,
                dev_observacao
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        let valores = [
            this.#pedId,
            this.#cliId,
            this.#proCodigo,
            this.#devQuantidade,
            this.#devMotivo,
            this.#devData,
            this.#devObservacao
        ];

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async devolverEstoque() {
        let sql = `
            UPDATE tb_produto
            SET pro_estoque = pro_estoque + ?
            WHERE pro_codigo = ?
        `;

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, [
            this.#devQuantidade,
            this.#proCodigo
        ]);
    }

    async atualizarStatusPedido(pedId, status) {
        let sql = `
            UPDATE tb_pedido
            SET ped_status = ?
            WHERE ped_id = ?
        `;

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, [
            status,
            pedId
        ]);
    }

    async deletar(id) {
        return false;
    }
}

module.exports = DevolucaoModel;