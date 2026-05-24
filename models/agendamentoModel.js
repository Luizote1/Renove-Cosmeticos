const Database = require("../utils/database");

class AgendamentoModel {

    #ageId;
    #serId;
    #proId;
    #ageClienteNome;
    #ageClienteTelefone;
    #ageData;
    #ageHora;
    #ageStatus;
    #ageObservacao;

    #serDescricao;
    #serCor;
    #proNome;

    get ageId() { return this.#ageId; }
    set ageId(value) { this.#ageId = value; }

    get serId() { return this.#serId; }
    set serId(value) { this.#serId = value; }

    get proId() { return this.#proId; }
    set proId(value) { this.#proId = value; }

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

    get proNome() { return this.#proNome; }
    set proNome(value) { this.#proNome = value; }

    constructor(
        ageId,
        serId,
        proId,
        ageClienteNome,
        ageClienteTelefone,
        ageData,
        ageHora,
        ageStatus,
        ageObservacao,
        serDescricao = "",
        serCor = "",
        proNome = ""
    ) {
        this.#ageId = ageId;
        this.#serId = serId;
        this.#proId = proId;
        this.#ageClienteNome = ageClienteNome;
        this.#ageClienteTelefone = ageClienteTelefone;
        this.#ageData = ageData;
        this.#ageHora = ageHora;
        this.#ageStatus = ageStatus;
        this.#ageObservacao = ageObservacao;
        this.#serDescricao = serDescricao;
        this.#serCor = serCor;
        this.#proNome = proNome;
    }

    async listar() {
        let sql = `
            select
                a.*,
                s.ser_descricao,
                s.ser_cor,
                p.pro_nome
            from tb_agendamento a
            inner join tb_servico s on a.ser_id = s.ser_id
            inner join tb_profissional p on a.pro_id = p.pro_id
            order by a.age_data, a.age_hora
        `;

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql);

        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            lista.push(new AgendamentoModel(
                rows[i]["age_id"],
                rows[i]["ser_id"],
                rows[i]["pro_id"],
                rows[i]["age_cliente_nome"],
                rows[i]["age_cliente_telefone"],
                rows[i]["age_data"],
                rows[i]["age_hora"],
                rows[i]["age_status"],
                rows[i]["age_observacao"],
                rows[i]["ser_descricao"],
                rows[i]["ser_cor"],
                rows[i]["pro_nome"]
            ));
        }

        return lista;
    }

    async obter(id) {
        let sql = "select * from tb_agendamento where age_id = ?";
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [id]);

        if (rows.length > 0) {
            return new AgendamentoModel(
                rows[0]["age_id"],
                rows[0]["ser_id"],
                rows[0]["pro_id"],
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
            insert into tb_agendamento
            (
                ser_id,
                pro_id,
                age_cliente_nome,
                age_cliente_telefone,
                age_data,
                age_hora,
                age_status,
                age_observacao
            )
            values (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        let valores = [
            this.#serId,
            this.#proId,
            this.#ageClienteNome,
            this.#ageClienteTelefone,
            this.#ageData,
            this.#ageHora,
            this.#ageStatus,
            this.#ageObservacao
        ];

        let banco = new Database();
        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async atualizarStatus(id, status) {
        let sql = `
            update tb_agendamento
            set age_status = ?
            where age_id = ?
        `;

        let banco = new Database();
        return await banco.ExecutaComandoNonQuery(sql, [status, id]);
    }

    async deletar(id) {
        let sql = "delete from tb_agendamento where age_id = ?";
        let banco = new Database();
        return await banco.ExecutaComandoNonQuery(sql, [id]);
    }

    toCalendarJson() {
        return {
            id: this.#ageId,

            title: `${this.#serDescricao} - ${this.#ageClienteNome}`,

            start: `${this.#ageData.toISOString().split("T")[0]}T${this.#ageHora}`,

            color: this.#serCor || "#ff5a00",

            extendedProps: {
                cliente: this.#ageClienteNome,
                telefone: this.#ageClienteTelefone,
                profissional: this.#proNome,
                status: this.#ageStatus,
                observacao: this.#ageObservacao
            }
        };
    }
}

module.exports = AgendamentoModel;  