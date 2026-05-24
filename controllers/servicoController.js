const ServicoModel = require("../models/servicoModel");
const ProfissionalModel = require("../models/profissionalModel");
const AgendamentoModel = require("../models/agendamentoModel");

class ServicoController {

    async listar(req, res) {
        let servicoModel = new ServicoModel();
        let profissionalModel = new ProfissionalModel();
        let agendamentoModel = new AgendamentoModel();

        let lista = await servicoModel.listar();
        let profissionais = await profissionalModel.listarAtivos();
        let servicosAtivos = await servicoModel.listarAtivos();

        let agendamentos = await agendamentoModel.listar();

        let eventos = [];

        for (let i = 0; i < agendamentos.length; i++) {
            eventos.push(agendamentos[i].toCalendarJson());
        }

        res.render("servico/lista", {
            layout: "layout",
            lista: lista,
            profissionais: profissionais,
            servicosAtivos: servicosAtivos,
            eventosJson: JSON.stringify(eventos || [])
        });
    }

    cadastrarView(req, res) {
        res.render("servico/cadastrar", {
            layout: "layout"
        });
    }

    async cadastrar(req, res) {
        let ok = false;
        let msg = "";

        if (
            req.body.descricao &&
            req.body.valor &&
            req.body.duracao
        ) {
            let model = new ServicoModel(
                0,
                req.body.descricao,
                req.body.detalhes,
                req.body.valor,
                req.body.duracao,
                req.body.cor || "#ff5a00",
                req.body.ativo == "s" ? "s" : "n"
            );

            ok = await model.cadastrar();

            if (ok) {
                msg = "Serviço cadastrado!";
            } else {
                msg = "Erro ao cadastrar serviço.";
            }

        } else {
            msg = "Preencha todos os campos obrigatórios.";
        }

        res.send({
            ok: ok,
            msg: msg
        });
    }

    async alterarView(req, res) {
        let model = new ServicoModel();
        let servico = await model.obter(req.params.id);

        res.render("servico/alterar", {
            layout: "layout",
            servico: servico
        });
    }

    async alterar(req, res) {
        let ok = false;
        let msg = "";

        if (
            req.body.id &&
            req.body.descricao &&
            req.body.valor &&
            req.body.duracao
        ) {
            let model = new ServicoModel(
                req.body.id,
                req.body.descricao,
                req.body.detalhes,
                req.body.valor,
                req.body.duracao,
                req.body.cor || "#ff5a00",
                req.body.ativo == "s" ? "s" : "n"
            );

            ok = await model.atualizar();

            if (ok) {
                msg = "Serviço atualizado!";
            } else {
                msg = "Erro ao atualizar serviço.";
            }

        } else {
            msg = "Preencha todos os campos obrigatórios.";
        }

        res.send({
            ok: ok,
            msg: msg
        });
    }

    async excluir(req, res) {
        let model = new ServicoModel();

        let ok = await model.deletar(req.body.id);

        res.send({
            ok: ok,
            msg: ok ? "Serviço excluído!" : "Erro ao excluir serviço."
        });
    }

    async agendar(req, res) {
        let ok = false;
        let msg = "";

        if (
            req.body.servico &&
            req.body.profissional &&
            req.body.cliente &&
            req.body.data &&
            req.body.hora
        ) {
            let agendamento = new AgendamentoModel(
                0,
                req.body.servico,
                req.body.profissional,
                req.body.cliente,
                req.body.telefone,
                req.body.data,
                req.body.hora,
                "Agendado",
                req.body.observacao
            );

            ok = await agendamento.cadastrar();

            if (ok) {
                msg = "Agendamento realizado!";
            } else {
                msg = "Erro ao realizar agendamento.";
            }

        } else {
            msg = "Preencha todos os campos obrigatórios.";
        }

        res.send({
            ok: ok,
            msg: msg
        });
    }

    async excluirAgendamento(req, res) {
        let model = new AgendamentoModel();

        let ok = await model.deletar(req.body.id);

        res.send({
            ok: ok,
            msg: ok ? "Agendamento removido!" : "Erro ao remover agendamento."
        });
    }
}

module.exports = ServicoController;