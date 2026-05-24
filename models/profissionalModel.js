const Database = require("../utils/database");

class ProfissionalModel {

    #proId;
    #proNome;
    #proEspecialidade;
    #proTelefone;
    #proAtivo;

    get proId() { return this.#proId; }
    set proId(value) { this.#proId = value; }

    get proNome() { return this.#proNome; }
    set proNome(value) { this.#proNome = value; }

    get proEspecialidade() { return this.#proEspecialidade; }
    set proEspecialidade(value) { this.#proEspecialidade = value; }

    get proTelefone() { return this.#proTelefone; }
    set proTelefone(value) { this.#proTelefone = value; }

    get proAtivo() { return this.#proAtivo; }
    set proAtivo(value) { this.#proAtivo = value; }

    constructor(proId, proNome, proEspecialidade, proTelefone, proAtivo) {
        this.#proId = proId;
        this.#proNome = proNome;
        this.#proEspecialidade = proEspecialidade;
        this.#proTelefone = proTelefone;
        this.#proAtivo = proAtivo;
    }

    async listar() {
        let sql = "select * from tb_profissional order by pro_nome";
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql);

        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            lista.push(new ProfissionalModel(
                rows[i]["pro_id"],
                rows[i]["pro_nome"],
                rows[i]["pro_especialidade"],
                rows[i]["pro_telefone"],
                rows[i]["pro_ativo"]
            ));
        }

        return lista;
    }

    async listarAtivos() {
        let sql = "select * from tb_profissional where pro_ativo = 's' order by pro_nome";
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql);

        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            lista.push(new ProfissionalModel(
                rows[i]["pro_id"],
                rows[i]["pro_nome"],
                rows[i]["pro_especialidade"],
                rows[i]["pro_telefone"],
                rows[i]["pro_ativo"]
            ));
        }

        return lista;
    }

    async obter(id) {
        let sql = "select * from tb_profissional where pro_id = ?";
        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [id]);

        if (rows.length > 0) {
            return new ProfissionalModel(
                rows[0]["pro_id"],
                rows[0]["pro_nome"],
                rows[0]["pro_especialidade"],
                rows[0]["pro_telefone"],
                rows[0]["pro_ativo"]
            );
        }

        return null;
    }

    async cadastrar() {
        let sql = `
            insert into tb_profissional
            (pro_nome, pro_especialidade, pro_telefone, pro_ativo)
            values (?, ?, ?, ?)
        `;

        let valores = [
            this.#proNome,
            this.#proEspecialidade,
            this.#proTelefone,
            this.#proAtivo
        ];

        let banco = new Database();
        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async atualizar() {
        let sql = `
            update tb_profissional
            set pro_nome = ?,
                pro_especialidade = ?,
                pro_telefone = ?,
                pro_ativo = ?
            where pro_id = ?
        `;

        let valores = [
            this.#proNome,
            this.#proEspecialidade,
            this.#proTelefone,
            this.#proAtivo,
            this.#proId
        ];

        let banco = new Database();
        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async deletar(id) {
        let sql = "delete from tb_profissional where pro_id = ?";
        let banco = new Database();
        return await banco.ExecutaComandoNonQuery(sql, [id]);
    }
}

module.exports = ProfissionalModel;