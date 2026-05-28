const ServicoModel = require("../models/servicoModel");
const UsuarioModel = require("../models/usuarioModel");
const AgendamentoModel = require("../models/agendamentoModel");

class ServicoController {

    async listar(req, res) {

        try {

            const servicoModel =
                new ServicoModel();

            const usuarioModel =
                new UsuarioModel();

            const agendamentoModel =
                new AgendamentoModel();


            const lista =
                await servicoModel.listar();

            const funcionarios =
                await usuarioModel.listarFuncionarios();

            const servicosAtivos =
                await servicoModel.listarAtivos();

            const agendamentos =
                await agendamentoModel.listar();


            let eventos = [];

            for (
                let i = 0;
                i < agendamentos.length;
                i++
            ) {

                eventos.push(
                    agendamentos[i]
                    .toCalendarJson()
                );

            }


            res.render("servico/lista", {

                layout: "layout",

                lista: lista,

                profissionais:
                    funcionarios,

                servicosAtivos:
                    servicosAtivos,

                eventosJson:
                    JSON.stringify(
                        eventos || []
                    )

            });

        }
        catch (erro) {

            console.log(
                "ERRO AO LISTAR SERVIÇOS:",
                erro
            );

            res.render(
                "servico/lista",
                {

                    layout: "layout",

                    lista: [],

                    profissionais: [],

                    servicosAtivos: [],

                    eventosJson: "[]"

                }
            );

        }

    }


    cadastrarView(req, res) {

        res.render(
            "servico/cadastrar",
            {
                layout: "layout"
            }
        );

    }


    async cadastrar(req, res) {

        try {

            let ok = false;
            let msg = "";


            if (

                req.body.descricao &&
                req.body.descricao.trim() != "" &&

                req.body.valor &&

                req.body.duracao

            ) {

                let model =
                    new ServicoModel(

                        0,

                        req.body.descricao
                        .trim(),

                        req.body.detalhes
                        || "",

                        req.body.valor,

                        req.body.duracao,

                        req.body.cor
                        || "#ff5a00",

                        req.body.ativo == "s"
                            ? "s"
                            : "n"

                    );


                let result =
                    await model.cadastrar();


                if (result) {

                    ok = true;

                    msg =
                        "Serviço cadastrado com sucesso!";

                }
                else {

                    msg =
                        "Não foi possível cadastrar o serviço.";

                }

            }
            else {

                msg =
                    "Preencha todos os campos obrigatórios.";

            }

            res.send({
                ok,
                msg
            });

        }
        catch (erro) {

            console.log(
                "ERRO AO CADASTRAR SERVIÇO:",
                erro
            );

            res.send({

                ok: false,

                msg:
                    "Erro interno ao cadastrar serviço."

            });

        }

    }


    async alterarView(req, res) {

        try {

            let model =
                new ServicoModel();

            let servico =
                await model.obter(
                    req.params.id
                );


            if (!servico) {

                return res.redirect(
                    "/servico"
                );

            }


            res.render(
                "servico/alterar",
                {

                    layout:
                        "layout",

                    servico:
                        servico

                }
            );

        }
        catch (erro) {

            console.log(
                "ERRO AO ABRIR ALTERAÇÃO:",
                erro
            );

            res.redirect(
                "/servico"
            );

        }

    }


    async alterar(req, res) {

        try {

            let ok = false;
            let msg = "";


            if (

                req.body.id &&

                req.body.descricao &&

                req.body.descricao
                .trim() != "" &&

                req.body.valor &&

                req.body.duracao

            ) {

                let model =
                    new ServicoModel(

                        req.body.id,

                        req.body.descricao
                        .trim(),

                        req.body.detalhes
                        || "",

                        req.body.valor,

                        req.body.duracao,

                        req.body.cor
                        || "#ff5a00",

                        req.body.ativo == "s"
                            ? "s"
                            : "n"

                    );


                let result =
                    await model
                    .atualizar();


                if (result) {

                    ok = true;

                    msg =
                        "Serviço alterado com sucesso!";

                }
                else {

                    msg =
                        "Não foi possível alterar o serviço.";

                }

            }
            else {

                msg =
                    "Preencha corretamente os campos obrigatórios.";

            }

            res.send({
                ok,
                msg
            });

        }
        catch (erro) {

            console.log(
                "ERRO AO ALTERAR SERVIÇO:",
                erro
            );

            res.send({

                ok: false,

                msg:
                    "Erro interno ao alterar serviço."

            });

        }

    }


    async excluir(req, res) {

        try {

            if (!req.body.id) {

                return res.send({

                    ok: false,

                    msg:
                        "ID do serviço não informado."

                });

            }


            let model =
                new ServicoModel();

            let result =
                await model.deletar(
                    req.body.id
                );


            if (result) {

                return res.send({

                    ok: true,

                    msg:
                        "Serviço excluído com sucesso!"

                });

            }


            return res.send({

                ok: false,

                msg:
                    "Não é possível excluir este serviço, pois existem agendamentos vinculados."

            });

        }
        catch (erro) {

            console.log(
                "ERRO AO EXCLUIR SERVIÇO:",
                erro
            );

            return res.send({

                ok: false,

                msg:
                    "Erro interno ao excluir serviço."

            });

        }

    }


    async agendar(req, res) {

        try {

            let ok = false;
            let msg = "";


            if (

                req.body.servico &&

                req.body.profissional &&

                req.body.cliente &&

                req.body.cliente
                .trim() != "" &&

                req.body.data &&

                req.body.hora

            ) {

                let agendamento =
                    new AgendamentoModel(

                        0,

                        req.body.servico,

                        req.body.profissional,

                        req.body.cliente
                        .trim(),

                        req.body.telefone
                        || "",

                        req.body.data,

                        req.body.hora,

                        "Agendado",

                        req.body.observacao
                        || ""

                    );


                let result =
                    await agendamento
                    .cadastrar();


                if (result) {

                    ok = true;

                    msg =
                        "Agendamento realizado com sucesso!";

                }
                else {

                    msg =
                        "Não foi possível realizar o agendamento.";

                }

            }
            else {

                msg =
                    "Preencha todos os campos obrigatórios.";

            }


            res.send({
                ok,
                msg
            });

        }
        catch (erro) {

            console.log(
                "ERRO AO AGENDAR:",
                erro
            );

            res.send({

                ok: false,

                msg:
                    "Erro interno ao realizar agendamento."

            });

        }

    }


    async excluirAgendamento(req, res) {

        try {

            if (!req.body.id) {

                return res.send({

                    ok: false,

                    msg:
                        "ID do agendamento não informado."

                });

            }


            let model =
                new AgendamentoModel();

            let result =
                await model.deletar(
                    req.body.id
                );


            if (result) {

                return res.send({

                    ok: true,

                    msg:
                        "Agendamento removido com sucesso!"

                });

            }


            return res.send({

                ok: false,

                msg:
                    "Não é possível remover um agendamento finalizado."

            });

        }
        catch (erro) {

            console.log(
                "ERRO AO EXCLUIR AGENDAMENTO:",
                erro
            );

            return res.send({

                ok: false,

                msg:
                    "Erro interno ao remover agendamento."

            });

        }

    }

}

module.exports = ServicoController;