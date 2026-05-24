const Database = require("../utils/database");

const banco = new Database();

class PedidoModel {

    async gravarEndereco(cli_id, cep, rua, numero, bairro, cidade, estado, complemento) {
        let sql = `
            INSERT INTO tb_endereco
            (cli_id, end_cep, end_rua, end_numero, end_bairro, end_cidade, end_estado, end_complemento)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        return await banco.ExecutaComandoLastInserted(sql, [
            cli_id, cep, rua, numero, bairro, cidade, estado, complemento
        ]);
    }

    async verificarEstoque(pro_codigo, quantidade) {
        let sql = `
            SELECT pro_estoque
            FROM tb_produto
            WHERE pro_codigo = ?
        `;

        let rows = await banco.ExecutaComando(sql, [pro_codigo]);

        if (rows.length === 0) return false;

        return Number(rows[0].pro_estoque) >= Number(quantidade);
    }

    async diminuirEstoque(pro_codigo, quantidade) {
        let sql = `
            UPDATE tb_produto
            SET pro_estoque = pro_estoque - ?
            WHERE pro_codigo = ?
            AND pro_estoque >= ?
        `;

        let resultado = await banco.ExecutaComandoNonQuery(sql, [
            quantidade, pro_codigo, quantidade
        ]);

        return resultado.affectedRows > 0;
    }

    async gravarPedido(cli_id, end_id, valorTotal, pagamento) {
        let sql = `
            INSERT INTO tb_pedido
            (cli_id, end_id, ped_valortotal, ped_pagamento, ped_status)
            VALUES (?, ?, ?, ?, ?)
        `;

        return await banco.ExecutaComandoLastInserted(sql, [
            cli_id, end_id, valorTotal, pagamento, "Realizado"
        ]);
    }

    async gravarItemPedido(ped_id, pro_codigo, quantidade, valorUnitario) {
        let valorTotal = Number(quantidade) * Number(valorUnitario);

        let sql = `
            INSERT INTO tb_pedidoitens
            (ped_id, pro_codigo, pit_quantidade, pit_valorunidade, pit_valortotal)
            VALUES (?, ?, ?, ?, ?)
        `;

        return await banco.ExecutaComandoNonQuery(sql, [
            ped_id, pro_codigo, quantidade, valorUnitario, valorTotal
        ]);
    }

    async listar(busca) {
        let sql = `
            SELECT 
                p.ped_id AS pedidoId,
                p.ped_data AS pedidoData,
                pr.pro_nome AS itemNome,
                i.pit_quantidade AS itemQuantidade,
                i.pit_valorunidade AS itemValor,
                i.pit_valortotal AS itemValorTotal,
                p.ped_valortotal AS pedidoValor,
                p.ped_pagamento AS pedidoPagamento,
                p.ped_status AS pedidoStatus
            FROM tb_pedido p
            INNER JOIN tb_pedidoitens i ON p.ped_id = i.ped_id
            INNER JOIN tb_produto pr ON i.pro_codigo = pr.pro_codigo
            WHERE p.ped_id LIKE ? OR pr.pro_nome LIKE ?
            ORDER BY p.ped_id DESC
        `;

        let termo = `%${busca || ""}%`;

        return await banco.ExecutaComando(sql, [termo, termo]);
    }

    async listarPedidosCliente(cli_id) {
        let sql = `
            SELECT 
                p.ped_id AS pedidoId,
                p.ped_data AS pedidoData,
                pr.pro_nome AS itemNome,
                i.pit_quantidade AS itemQuantidade,
                i.pit_valorunidade AS itemValor,
                i.pit_valortotal AS itemValorTotal,
                p.ped_valortotal AS pedidoValor,
                p.ped_pagamento AS pedidoPagamento,
                p.ped_status AS pedidoStatus
            FROM tb_pedido p
            INNER JOIN tb_pedidoitens i ON p.ped_id = i.ped_id
            INNER JOIN tb_produto pr ON i.pro_codigo = pr.pro_codigo
            WHERE p.cli_id = ?
            ORDER BY p.ped_id DESC
        `;

        return await banco.ExecutaComando(sql, [cli_id]);
    }

    async buscarPedido(id) {
        let sql = `
            SELECT
                p.ped_id,
                p.ped_data,
                p.ped_valortotal,
                p.ped_pagamento,
                p.ped_status,

                c.cli_nome,
                c.cli_cpf,
                c.cli_email,
                c.cli_telefone,

                e.end_cep,
                e.end_rua,
                e.end_numero,
                e.end_bairro,
                e.end_cidade,
                e.end_estado,
                e.end_complemento,

                pr.pro_nome,
                i.pit_quantidade,
                i.pit_valorunidade,
                i.pit_valortotal

            FROM tb_pedido p

            INNER JOIN tb_cliente c 
                ON p.cli_id = c.cli_id

            INNER JOIN tb_endereco e
                ON p.end_id = e.end_id

            INNER JOIN tb_pedidoitens i
                ON p.ped_id = i.ped_id

            INNER JOIN tb_produto pr
                ON i.pro_codigo = pr.pro_codigo

            WHERE p.ped_id = ?
        `;

        return await banco.ExecutaComando(sql, [id]);
    }
}

module.exports = PedidoModel;