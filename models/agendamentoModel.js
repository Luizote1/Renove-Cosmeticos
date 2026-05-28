const Database = require("../utils/database");

class AgendamentoModel {

    #ageId;
    #serId;
    #usuId;
    #ageClienteNome;
    #ageClienteTelefone;
    #ageData;
    #ageHora;
    #ageStatus;
    #ageObservacao;

    #serDescricao;
    #serCor;
    #usuNome;

    get ageId() { return this.#ageId; }
    set ageId(value) { this.#ageId = value; }

    get serId() { return this.#serId; }
    set serId(value) { this.#serId = value; }

    get usuId() { return this.#usuId; }
    set usuId(value) { this.#usuId = value; }

    get ageClienteNome() { return this.#ageClienteNome; }
    set ageClienteNome(value) { this.#ageClienteNome = value; }

    get ageClienteTelefone() { return this.#ageClienteTelefone; }
    set ageClienteTelefone(value) { this.#ageClienteTelefone = value; }

    get ageData() { return this.#ageData; }
    set ageData(value) { this.#ageData = value; }

    get ageHora() { return this.#ageHora; }
    set ageHora(value) { this.#ageHora = value; }

    get ageStatus() { return this.#ageStatus; }
    set ageStatus(value) { this.#ageStatus = value; }

    get ageObservacao() { return this.#ageObservacao; }
    set ageObservacao(value) { this.#ageObservacao = value; }

    get serDescricao() { return this.#serDescricao; }
    set serDescricao(value) { this.#serDescricao = value; }

    get serCor() { return this.#serCor; }
    set serCor(value) { this.#serCor = value; }

    get usuNome() { return this.#usuNome; }
    set usuNome(value) { this.#usuNome = value; }

    constructor(
        ageId,
        serId,
        usuId,
        ageClienteNome,
        ageClienteTelefone,
        ageData,
        ageHora,
        ageStatus,
        ageObservacao,
        serDescricao = "",
        serCor = "",
        usuNome = ""
    ) {
        this.#ageId = ageId;
        this.#serId = serId;
        this.#usuId = usuId;
        this.#ageClienteNome = ageClienteNome;
        this.#ageClienteTelefone = ageClienteTelefone;
        this.#ageData = ageData;
        this.#ageHora = ageHora;
        this.#ageStatus = ageStatus;
        this.#ageObservacao = ageObservacao;
        this.#serDescricao = serDescricao;
        this.#serCor = serCor;
        this.#usuNome = usuNome;
    }

    async listar() {
        let sql = `
            SELECT
                a.*,
                s.ser_descricao,
                s.ser_cor,
                u.usu_nome
            FROM tb_agendamento a
            INNER JOIN tb_servico s
                ON a.ser_id = s.ser_id
            INNER JOIN tb_usuario u
                ON a.usu_id = u.usu_id
            ORDER BY a.age_data, a.age_hora
        `;

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql);

        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            lista.push(new AgendamentoModel(
                rows[i]["age_id"],
                rows[i]["ser_id"],
                rows[i]["usu_id"],
                rows[i]["age_cliente_nome"],
                rows[i]["age_cliente_telefone"],
                rows[i]["age_data"],
                rows[i]["age_hora"],
                rows[i]["age_status"],
                rows[i]["age_observacao"],
                rows[i]["ser_descricao"],
                rows[i]["ser_cor"],
                rows[i]["usu_nome"]
            ));
        }

        return lista;
    }

    async obter(id) {
        let sql = `
            SELECT *
            FROM tb_agendamento
            WHERE age_id = ?
        `;

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [id]);

        if (rows.length > 0) {
            return new AgendamentoModel(
                rows[0]["age_id"],
                rows[0]["ser_id"],
                rows[0]["usu_id"],
                rows[0]["age_cliente_nome"],
                rows[0]["age_cliente_telefone"],
                rows[0]["age_data"],
                rows[0]["age_hora"],
                rows[0]["age_status"],
                rows[0]["age_observacao"]
            );
        }

        return null;
    }

    async cadastrar() {
        let sql = `
            INSERT INTO tb_agendamento
            (
                ser_id,
                usu_id,
                age_cliente_nome,
                age_cliente_telefone,
                age_data,
                age_hora,
                age_status,
                age_observacao
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, [
            this.#serId,
            this.#usuId,
            this.#ageClienteNome,
            this.#ageClienteTelefone,
            this.#ageData,
            this.#ageHora,
            this.#ageStatus,
            this.#ageObservacao
        ]);
    }

    async atualizarStatus(id, status) {
        let sql = `
            UPDATE tb_agendamento
            SET age_status = ?
            WHERE age_id = ?
        `;

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, [
            status,
            id
        ]);
    }

    async estaFinalizado(id) {
        let sql = `
            SELECT COUNT(*) AS total
            FROM tb_agendamento
            WHERE age_id = ?
              AND age_status = 'Finalizado'
        `;

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [id]);

        return rows[0].total > 0;
    }

    async deletar(id) {
        if (await this.estaFinalizado(id)) {
            return false;
        }

        let sql = `
            DELETE FROM tb_agendamento
            WHERE age_id = ?
        `;

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, [id]);
    }

    toCalendarJson() {
        let dataFormatada = "";

        if (this.#ageData instanceof Date) {
            dataFormatada = this.#ageData.toISOString().split("T")[0];
        } else {
            dataFormatada = String(this.#ageData).split("T")[0];
        }

        return {
            id: this.#ageId,

            title: `${this.#serDescricao} - ${this.#ageClienteNome}`,

            start: `${dataFormatada}T${this.#ageHora}`,

            color: this.#serCor || "#ff5a00",

            extendedProps: {
                cliente: this.#ageClienteNome,
                telefone: this.#ageClienteTelefone,
                funcionario: this.#usuNome,
                profissional: this.#usuNome,
                status: this.#ageStatus,
                observacao: this.#ageObservacao
            }
        };
    }
}

module.exports = AgendamentoModel;