const Database = require("../utils/database");

class LaboratorioModel {

    #labId;
    #labNome;
    #labTelefone;
    #labEmail;
    #labAtivo;

    constructor(labId, labNome, labTelefone, labEmail, labAtivo) {
        this.#labId = labId;
        this.#labNome = labNome;
        this.#labTelefone = labTelefone;
        this.#labEmail = labEmail;
        this.#labAtivo = labAtivo;
    }

    get labId() { return this.#labId; }
    set labId(value) { this.#labId = value; }

    get labNome() { return this.#labNome; }
    set labNome(value) { this.#labNome = value; }

    get labTelefone() { return this.#labTelefone; }
    set labTelefone(value) { this.#labTelefone = value; }

    get labEmail() { return this.#labEmail; }
    set labEmail(value) { this.#labEmail = value; }

    get labAtivo() { return this.#labAtivo; }
    set labAtivo(value) { this.#labAtivo = value; }

    async listar() {
        let sql = "select * from tb_laboratorio order by lab_id";

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql);

        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            lista.push(new LaboratorioModel(
                rows[i]["lab_id"],
                rows[i]["lab_nome"],
                rows[i]["lab_telefone"],
                rows[i]["lab_email"],
                rows[i]["lab_ativo"]
            ));
        }

        return lista;
    }

    async obter(id) {
        let sql = "select * from tb_laboratorio where lab_id = ?";

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [id]);

        if (rows.length > 0) {
            return new LaboratorioModel(
                rows[0]["lab_id"],
                rows[0]["lab_nome"],
                rows[0]["lab_telefone"],
                rows[0]["lab_email"],
                rows[0]["lab_ativo"]
            );
        }

        return null;
    }

    async cadastrar() {
        let sql = `
            insert into tb_laboratorio
            (lab_nome, lab_telefone, lab_email, lab_ativo)
            values (?, ?, ?, ?)
        `;

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, [
            this.#labNome,
            this.#labTelefone,
            this.#labEmail,
            this.#labAtivo
        ]);
    }

    async atualizar() {
        let sql = `
            update tb_laboratorio
            set lab_nome = ?, lab_telefone = ?, lab_email = ?, lab_ativo = ?
            where lab_id = ?
        `;

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, [
            this.#labNome,
            this.#labTelefone,
            this.#labEmail,
            this.#labAtivo,
            this.#labId
        ]);
    }

    async estaEmUso(id) {
        let sql = `
            select count(*) as total
            from tb_produto
            where lab_id = ?
        `;

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [id]);

        return rows[0].total > 0;
    }

    async deletar(id) {
        if (await this.estaEmUso(id)) {
            return false;
        }

        let sql = "delete from tb_laboratorio where lab_id = ?";

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, [id]);
    }
}

module.exports = LaboratorioModel;