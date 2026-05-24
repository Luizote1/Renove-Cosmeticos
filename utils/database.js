const mysql = require("mysql2");

class Database {

    #conexao;

    get conexao() {
        return this.#conexao;
    }

    set conexao(conexao) {
        this.#conexao = conexao;
    }

    constructor() {

        this.#conexao = mysql.createPool({
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            idleTimeout: 30000,
            connectionLimit: 50
        });
    }

    ExecutaComando(sql, valores = []) {
        let cnn = this.#conexao;

        return new Promise(function (res, rej) {
            cnn.query(sql, valores, function (error, results) {
                if (error) {
                    rej(error);
                } else {
                    res(results);
                }
            });
        });
    }

    ExecutaComandoNonQuery(sql, valores = []) {
        let cnn = this.#conexao;

        return new Promise(function (res, rej) {
            cnn.query(sql, valores, function (error, results) {
                if (error) {
                    rej(error);
                } else {
                    res(results);
                }
            });
        });
    }

    ExecutaComandoLastInserted(sql, valores = []) {
        let cnn = this.#conexao;

        return new Promise(function (res, rej) {
            cnn.query(sql, valores, function (error, results) {
                if (error) {
                    rej(error);
                } else {
                    res(results.insertId);
                }
            });
        });
    }
}

module.exports = Database;