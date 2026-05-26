const mysql = require("mysql2");

let pool = null;

class Database {

    #conexao;

    get conexao() {
        return this.#conexao;
    }

    set conexao(conexao) {
        this.#conexao = conexao;
    }

    constructor() {

        if (!pool) {

            pool = mysql.createPool({

                host: process.env.DB_HOST,
                database: process.env.DB_DATABASE,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                port: process.env.DB_PORT,

                waitForConnections: true,
                connectionLimit: 5,
                queueLimit: 0,

                idleTimeout: 30000

            });

            console.log("POOL MYSQL INICIADO");
        }

        this.#conexao = pool;
    }

    ExecutaComando(sql, valores = []) {

        let cnn = this.#conexao;

        return new Promise(function (res, rej) {

            cnn.query(sql, valores, function (error, results) {

                if (error) {
                    rej(error);
                }
                else {
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
                }
                else {
                    res(results.affectedRows > 0);
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
                }
                else {
                    res(results.insertId);
                }

            });

        });
    }
}

module.exports = Database;