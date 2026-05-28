const Database = require("../utils/database");

class ClienteModel {

    #cliId;
    #cliNome;
    #cliCpf;
    #cliNascimento;
    #cliGenero;
    #cliTelefone;
    #cliEmail;
    #cliSenha;
    #cliAtivo;

    constructor(
        cliId,
        cliNome,
        cliCpf,
        cliNascimento,
        cliGenero,
        cliTelefone,
        cliEmail,
        cliSenha,
        cliAtivo
    ) {
        this.#cliId = cliId;
        this.#cliNome = cliNome;
        this.#cliCpf = cliCpf;
        this.#cliNascimento = cliNascimento;
        this.#cliGenero = cliGenero;
        this.#cliTelefone = cliTelefone;
        this.#cliEmail = cliEmail;
        this.#cliSenha = cliSenha;
        this.#cliAtivo = cliAtivo;
    }

    get cliId() { return this.#cliId; }
    get cliNome() { return this.#cliNome; }
    get cliCpf() { return this.#cliCpf; }
    get cliNascimento() { return this.#cliNascimento; }
    get cliGenero() { return this.#cliGenero; }
    get cliTelefone() { return this.#cliTelefone; }
    get cliEmail() { return this.#cliEmail; }
    get cliSenha() { return this.#cliSenha; }
    get cliAtivo() { return this.#cliAtivo; }

    async listar() {

        let sql = "select * from tb_cliente order by cli_id asc";

        let banco = new Database();

        let rows = await banco.ExecutaComando(sql);

        let lista = [];

        for (let i = 0; i < rows.length; i++) {

            lista.push(new ClienteModel(
                rows[i]["cli_id"],
                rows[i]["cli_nome"],
                rows[i]["cli_cpf"],
                rows[i]["cli_nascimento"],
                rows[i]["cli_genero"],
                rows[i]["cli_telefone"],
                rows[i]["cli_email"],
                rows[i]["cli_senha"],
                rows[i]["cli_ativo"]
            ));
        }

        return lista;
    }

    async obter(id) {

        let sql = "select * from tb_cliente where cli_id = ?";

        let banco = new Database();

        let rows = await banco.ExecutaComando(sql, [id]);

        if (rows.length > 0) {

            return new ClienteModel(
                rows[0]["cli_id"],
                rows[0]["cli_nome"],
                rows[0]["cli_cpf"],
                rows[0]["cli_nascimento"],
                rows[0]["cli_genero"],
                rows[0]["cli_telefone"],
                rows[0]["cli_email"],
                rows[0]["cli_senha"],
                rows[0]["cli_ativo"]
            );
        }

        return null;
    }

    async cadastrar() {

        let sql = `
            insert into tb_cliente
            (
                cli_nome,
                cli_cpf,
                cli_nascimento,
                cli_genero,
                cli_telefone,
                cli_email,
                cli_senha,
                cli_ativo
            )
            values (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        let valores = [
            this.#cliNome,
            this.#cliCpf,
            this.#cliNascimento,
            this.#cliGenero,
            this.#cliTelefone,
            this.#cliEmail,
            this.#cliSenha,
            this.#cliAtivo
        ];

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async atualizar() {

        let sql = `
            update tb_cliente
            set
                cli_nome = ?,
                cli_cpf = ?,
                cli_nascimento = ?,
                cli_genero = ?,
                cli_telefone = ?,
                cli_email = ?,
                cli_senha = ?,
                cli_ativo = ?
            where cli_id = ?
        `;

        let valores = [
            this.#cliNome,
            this.#cliCpf,
            this.#cliNascimento,
            this.#cliGenero,
            this.#cliTelefone,
            this.#cliEmail,
            this.#cliSenha,
            this.#cliAtivo,
            this.#cliId
        ];

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async estaEmUso(id) {
        let sql = `
        select count(*) as total
        from tb_pedido
        where cli_id = ?
    `;

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [id]);

        return rows[0].total > 0;
    }

    async deletar(id) {

        if (await this.estaEmUso(id)) {
            return false;
        }

        let sql = "delete from tb_cliente where cli_id = ?";

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, [id]);
    }

    async autenticar(emailCpf, senha) {

        let sql = `
            select * from tb_cliente
            where (cli_email = ? or cli_cpf = ?)
            and cli_senha = ?
            and cli_ativo = 's'
        `;

        let banco = new Database();

        let rows = await banco.ExecutaComando(sql, [
            emailCpf,
            emailCpf,
            senha
        ]);

        if (rows.length > 0) {

            return new ClienteModel(
                rows[0]["cli_id"],
                rows[0]["cli_nome"],
                rows[0]["cli_cpf"],
                rows[0]["cli_nascimento"],
                rows[0]["cli_genero"],
                rows[0]["cli_telefone"],
                rows[0]["cli_email"],
                rows[0]["cli_senha"],
                rows[0]["cli_ativo"]
            );
        }

        return null;
    }

    static async buscarPorCpf(cpf) {

        let sql = "select * from tb_cliente where cli_cpf = ?";

        let banco = new Database();

        let rows = await banco.ExecutaComando(sql, [cpf]);

        return rows.length > 0;
    }

    static async buscarPorEmail(email) {

        let sql = "select * from tb_cliente where cli_email = ?";

        let banco = new Database();

        let rows = await banco.ExecutaComando(sql, [email]);

        return rows.length > 0;
    }

    async atualizarPerfil() {

        let sql = `
        update tb_cliente
        set
            cli_nome = ?,
            cli_nascimento = ?,
            cli_genero = ?,
            cli_telefone = ?
        where cli_id = ?
    `;

        let valores = [
            this.#cliNome,
            this.#cliNascimento,
            this.#cliGenero,
            this.#cliTelefone,
            this.#cliId
        ];

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, valores);
    }
}

module.exports = ClienteModel;