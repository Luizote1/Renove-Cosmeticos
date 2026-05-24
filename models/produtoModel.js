const Database = require("../utils/database");
const fs = require("fs");

class ProdutoModel {

    #proCodigo;
    #proNome;
    #proDescricao;
    #proPreco;
    #proEstoque;
    #proDataValidade;
    #proAtivo;
    #proImagem;
    #catId;
    #tipId;
    #labId;
    #catDescricao;
    #tipDescricao;
    #labNome;

    get proCodigo() { return this.#proCodigo; }
    set proCodigo(value) { this.#proCodigo = value; }

    get proNome() { return this.#proNome; }
    set proNome(value) { this.#proNome = value; }

    get proDescricao() { return this.#proDescricao; }
    set proDescricao(value) { this.#proDescricao = value; }

    get proPreco() { return this.#proPreco; }
    set proPreco(value) { this.#proPreco = value; }

    get proEstoque() { return this.#proEstoque; }
    set proEstoque(value) { this.#proEstoque = value; }

    get proDataValidade() { return this.#proDataValidade; }
    set proDataValidade(value) { this.#proDataValidade = value; }

    get proAtivo() { return this.#proAtivo; }
    set proAtivo(value) { this.#proAtivo = value; }

    get proImagem() { return this.#proImagem; }
    set proImagem(value) { this.#proImagem = value; }

    get catId() { return this.#catId; }
    set catId(value) { this.#catId = value; }

    get tipId() { return this.#tipId; }
    set tipId(value) { this.#tipId = value; }

    get labId() { return this.#labId; }
    set labId(value) { this.#labId = value; }

    get catDescricao() { return this.#catDescricao; }
    set catDescricao(value) { this.#catDescricao = value; }

    get tipDescricao() { return this.#tipDescricao; }
    set tipDescricao(value) { this.#tipDescricao = value; }

    get labNome() { return this.#labNome; }
    set labNome(value) { this.#labNome = value; }

    constructor(
        proCodigo,
        proNome,
        proDescricao,
        proPreco,
        proEstoque,
        proDataValidade,
        proAtivo,
        proImagem,
        catId,
        tipId,
        labId,
        catDescricao = "",
        tipDescricao = "",
        labNome = ""
    ) {
        this.#proCodigo = proCodigo;
        this.#proNome = proNome;
        this.#proDescricao = proDescricao;
        this.#proPreco = proPreco;
        this.#proEstoque = proEstoque;
        this.#proDataValidade = proDataValidade;
        this.#proAtivo = proAtivo;
        this.#proImagem = proImagem;
        this.#catId = catId;
        this.#tipId = tipId;
        this.#labId = labId;
        this.#catDescricao = catDescricao;
        this.#tipDescricao = tipDescricao;
        this.#labNome = labNome;
    }

    montarImagem(imagemBanco) {
        let imagem = "";

        if (
            imagemBanco != null &&
            imagemBanco != "" &&
            fs.existsSync(global.CAMINHO_IMG_ABS + imagemBanco)
        ) {
            imagem = global.CAMINHO_IMG + imagemBanco;
        }
        else {
            imagem = global.CAMINHO_IMG + "produto-sem-imagem.png";
        }

        return imagem;
    }

    async cadastrar() {

        let sql = `
            insert into tb_produto
            (
                pro_codigo,
                pro_nome,
                pro_descricao,
                pro_preco,
                pro_estoque,
                pro_data_validade,
                pro_ativo,
                pro_imagem,
                cat_id,
                tip_id,
                lab_id
            )
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        let valores = [
            this.#proCodigo,
            this.#proNome,
            this.#proDescricao,
            this.#proPreco,
            this.#proEstoque,
            this.#proDataValidade,
            this.#proAtivo,
            this.#proImagem,
            this.#catId,
            this.#tipId,
            this.#labId
        ];

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async obter(codigo) {

        let sql = `
            select
                p.*,
                c.cat_descricao,
                t.tip_descricao,
                l.lab_nome
            from tb_produto p
            inner join tb_categoria c on p.cat_id = c.cat_id
            inner join tb_tipo_produto t on p.tip_id = t.tip_id
            inner join tb_laboratorio l on p.lab_id = l.lab_id
            where p.pro_codigo = ?
        `;

        let banco = new Database();
        let rows = await banco.ExecutaComando(sql, [codigo]);

        if (rows.length > 0) {

            let row = rows[0];

            let imagem = this.montarImagem(row["pro_imagem"]);

            return new ProdutoModel(
                row["pro_codigo"],
                row["pro_nome"],
                row["pro_descricao"],
                row["pro_preco"],
                row["pro_estoque"],
                row["pro_data_validade"],
                row["pro_ativo"],
                imagem,
                row["cat_id"],
                row["tip_id"],
                row["lab_id"],
                row["cat_descricao"],
                row["tip_descricao"],
                row["lab_nome"]
            );
        }

        return null;
    }

    async atualizar(codigoAntigo) {

        let sql = `
            update tb_produto
            set
                pro_codigo = ?,
                pro_nome = ?,
                pro_descricao = ?,
                pro_preco = ?,
                pro_estoque = ?,
                pro_data_validade = ?,
                pro_ativo = ?,
                pro_imagem = ?,
                cat_id = ?,
                tip_id = ?,
                lab_id = ?
            where pro_codigo = ?
        `;

        let valores = [
            this.#proCodigo,
            this.#proNome,
            this.#proDescricao,
            this.#proPreco,
            this.#proEstoque,
            this.#proDataValidade,
            this.#proAtivo,
            this.#proImagem,
            this.#catId,
            this.#tipId,
            this.#labId,
            codigoAntigo
        ];

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, valores) > 0;
    }

    async deletar(codigo) {

        let produto = await this.obter(codigo);

        if (produto && produto.proImagem) {

            let nomeImg = produto.proImagem.split("/").pop();

            if (nomeImg != "produto-sem-imagem.png") {

                let caminho = global.CAMINHO_IMG_ABS + nomeImg;

                if (fs.existsSync(caminho)) {
                    fs.unlinkSync(caminho);
                }
            }
        }

        let sql = "delete from tb_produto where pro_codigo = ?";

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, [codigo]);
    }

    async listar() {

        let sql = `
            select
                p.*,
                c.cat_descricao,
                t.tip_descricao,
                l.lab_nome
            from tb_produto p
            inner join tb_categoria c on p.cat_id = c.cat_id
            inner join tb_tipo_produto t on p.tip_id = t.tip_id
            inner join tb_laboratorio l on p.lab_id = l.lab_id
            order by p.pro_codigo
        `;

        let banco = new Database();

        let rows = await banco.ExecutaComando(sql);

        let lista = [];

        for (let i = 0; i < rows.length; i++) {

            let imagem = this.montarImagem(rows[i]["pro_imagem"]);

            lista.push(
                new ProdutoModel(
                    rows[i]["pro_codigo"],
                    rows[i]["pro_nome"],
                    rows[i]["pro_descricao"],
                    rows[i]["pro_preco"],
                    rows[i]["pro_estoque"],
                    rows[i]["pro_data_validade"],
                    rows[i]["pro_ativo"],
                    imagem,
                    rows[i]["cat_id"],
                    rows[i]["tip_id"],
                    rows[i]["lab_id"],
                    rows[i]["cat_descricao"],
                    rows[i]["tip_descricao"],
                    rows[i]["lab_nome"]
                )
            );
        }

        return lista;
    }

    async listarAtivos() {

        let sql = `
        select
            p.*,
            c.cat_descricao,
            t.tip_descricao,
            l.lab_nome
        from tb_produto p
        inner join tb_categoria c on p.cat_id = c.cat_id
        inner join tb_tipo_produto t on p.tip_id = t.tip_id
        inner join tb_laboratorio l on p.lab_id = l.lab_id
        where p.pro_ativo = 's'
        order by p.pro_codigo
    `;

        let banco = new Database();

        let rows = await banco.ExecutaComando(sql);

        let lista = [];

        for (let i = 0; i < rows.length; i++) {

            let imagem = this.montarImagem(rows[i]["pro_imagem"]);

            lista.push(
                new ProdutoModel(
                    rows[i]["pro_codigo"],
                    rows[i]["pro_nome"],
                    rows[i]["pro_descricao"],
                    rows[i]["pro_preco"],
                    rows[i]["pro_estoque"],
                    rows[i]["pro_data_validade"],
                    rows[i]["pro_ativo"],
                    imagem,
                    rows[i]["cat_id"],
                    rows[i]["tip_id"],
                    rows[i]["lab_id"],
                    rows[i]["cat_descricao"],
                    rows[i]["tip_descricao"],
                    rows[i]["lab_nome"]
                )
            );
        }

        return lista;
    }

    async atualizarEstoque(produtoCodigo, novaQuantidade) {

        let sql = `
            update tb_produto
            set pro_estoque = ?
            where pro_codigo = ?
        `;

        let valores = [novaQuantidade, produtoCodigo];

        let banco = new Database();

        return await banco.ExecutaComandoNonQuery(sql, valores) > 0;
    }

    async listarDestaques() {

        let sql = `
        SELECT *
        FROM tb_produto
        WHERE pro_ativo = 's'
        AND pro_estoque > 0
        ORDER BY pro_codigo DESC
        LIMIT 3
    `;

        let banco = new Database();

        let rows = await banco.ExecutaComando(sql);

        let lista = [];

        for (let i = 0; i < rows.length; i++) {

            let imagem =
                this.montarImagem(
                    rows[i]["pro_imagem"]
                );

            lista.push(
                new ProdutoModel(
                    rows[i]["pro_codigo"],
                    rows[i]["pro_nome"],
                    rows[i]["pro_descricao"],
                    rows[i]["pro_preco"],
                    rows[i]["pro_estoque"],
                    rows[i]["pro_data_validade"],
                    rows[i]["pro_ativo"],
                    imagem,
                    rows[i]["cat_id"],
                    rows[i]["tip_id"],
                    rows[i]["lab_id"]
                )
            );
        }

        return lista;
    }

    toJSON() {
        return {
            proCodigo: this.#proCodigo,
            proNome: this.#proNome,
            proDescricao: this.#proDescricao,
            proPreco: this.#proPreco,
            proImagem: this.#proImagem,
            proEstoque: this.#proEstoque,
            proDataValidade: this.#proDataValidade,
            catDescricao: this.#catDescricao,
            tipDescricao: this.#tipDescricao,
            labNome: this.#labNome
        };
    }
}

module.exports = ProdutoModel;