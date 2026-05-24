const Database = require("../utils/database");

class ServicoModel {

    #serId;
    #serDescricao;
    #serDetalhes;
    #serValor;
    #serDuracaoMinutos;
    #serCor;
    #serAtivo;

    get serId() { return this.#serId; }
    set serId(value) { this.#serId = value; }

    get serDescricao() { return this.#serDescricao; }
    set serDescricao(value) { this.#serDescricao = value; }

    get serDetalhes() { return this.#serDetalhes; }
    set serDetalhes(value) { this.#serDetalhes = value; }

    get serValor() { return this.#serValor; }
    set serValor(value) { this.#serValor = value; }

    get serDuracaoMinutos() { return this.#serDuracaoMinutos; }
    set serDuracaoMinutos(value) { this.#serDuracaoMinutos = value; }

    get serCor() { return this.#serCor; }
    set serCor(value) { this.#serCor = value; }

    get serAtivo() { return this.#serAtivo; }
    set serAtivo(value) { this.#serAtivo = value; }

    constructor(
        serId,
        serDescricao,
        serDetalhes,
        serValor,
        serDuracaoMinutos,
        serCor,
        serAtivo
    ) {
        this.#serId = serId;
        this.#serDescricao = serDescricao;
        this.#serDetalhes = serDetalhes;
        this.#serValor = serValor;
        this.#serDuracaoMinutos = serDuracaoMinutos;
        this.#serCor = serCor;
        this.#serAtivo = serAtivo;
    }

    async listar() {
        let sql = "select * from tb_servico order by ser_descricao";
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql);

        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            lista.push(new ServicoModel(
                rows[i]["ser_id"],
                rows[i]["ser_descricao"],
                rows[i]["ser_detalhes"],
                rows[i]["ser_valor"],
                rows[i]["ser_duracao_minutos"],
                rows[i]["ser_cor"],
                rows[i]["ser_ativo"]
            ));
        }

        return lista;
    }

    async listarAtivos() {
        let sql = "select * from tb_servico where ser_ativo = 's' order by ser_descricao";
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql);

        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            lista.push(new ServicoModel(
                rows[i]["ser_id"],
                rows[i]["ser_descricao"],
                rows[i]["ser_detalhes"],
                rows[i]["ser_valor"],
                rows[i]["ser_duracao_minutos"],
                rows[i]["ser_cor"],
                rows[i]["ser_ativo"]
            ));
        }

        return lista;
    }

    async obter(id) {
        let sql = "select * from tb_servico where ser_id = ?";
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [id]);

        if (rows.length > 0) {
            return new ServicoModel(
                rows[0]["ser_id"],
                rows[0]["ser_descricao"],
                rows[0]["ser_detalhes"],
                rows[0]["ser_valor"],
                rows[0]["ser_duracao_minutos"],
                rows[0]["ser_cor"],
                rows[0]["ser_ativo"]
            );
        }

        return null;
    }

    async cadastrar() {
        let sql = `
            insert into tb_servico
            (ser_descricao, ser_detalhes, ser_valor, ser_duracao_minutos, ser_cor, ser_ativo)
            values (?, ?, ?, ?, ?, ?)
        `;

        let valores = [
            this.#serDescricao,
            this.#serDetalhes,
            this.#serValor,
            this.#serDuracaoMinutos,
            this.#serCor,
            this.#serAtivo
        ];

        let banco = new Database();
        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async atualizar() {
        let sql = `
            update tb_servico
            set ser_descricao = ?,
                ser_detalhes = ?,
                ser_valor = ?,
                ser_duracao_minutos = ?,
                ser_cor = ?,
                ser_ativo = ?
            where ser_id = ?
        `;

        let valores = [
            this.#serDescricao,
            this.#serDetalhes,
            this.#serValor,
            this.#serDuracaoMinutos,
            this.#serCor,
            this.#serAtivo,
            this.#serId
        ];

        let banco = new Database();
        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async deletar(id) {
        let sql = "delete from tb_servico where ser_id = ?";
        let banco = new Database();
        return await banco.ExecutaComandoNonQuery(sql, [id]);
    }
}

module.exports = ServicoModel;