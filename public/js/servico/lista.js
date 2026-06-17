document.addEventListener("DOMContentLoaded", function () {

    const btnAbrirAgendamento = document.getElementById("btnAbrirAgendamento");
    const modalEl = document.getElementById("modalAgendamento");

    let modalAgendamento = null;

    if (modalEl) {
        modalAgendamento = new bootstrap.Modal(modalEl);
    }

    if (btnAbrirAgendamento && modalAgendamento) {
        btnAbrirAgendamento.addEventListener("click", function () {
            modalAgendamento.show();
        });
    }

    const botoesFechar = document.querySelectorAll("[data-bs-dismiss='modal']");

    botoesFechar.forEach(function (botao) {
        botao.addEventListener("click", function () {
            if (modalAgendamento) {
                modalAgendamento.hide();
            }
        });
    });

    const btnsExcluir = document.querySelectorAll(".btnExcluir");

    btnsExcluir.forEach(function (btn) {
        btn.addEventListener("click", function () {

            const id = this.dataset.id;

            if (!id) {
                alert("ID do serviço não encontrado.");
                return;
            }

            if (!confirm("Deseja excluir este serviço?")) {
                return;
            }

            fetch("/servico/deletar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id
                })
            })
            .then(function (resposta) {
                return resposta.json();
            })
            .then(function (corpo) {
                alert(corpo.msg);

                if (corpo.ok) {
                    window.location.reload();
                }
            })
            .catch(function (erro) {
                console.error("ERRO AO EXCLUIR SERVIÇO:", erro);
                alert("Erro ao excluir serviço.");
            });

        });
    });

    let eventos = [];

    const eventosInput = document.getElementById("eventosJson");

    if (eventosInput) {
        try {
            eventos = JSON.parse(eventosInput.value);
        } catch (erro) {
            console.error("Erro ao carregar eventos:", erro);
            eventos = [];
        }
    }

    const calendarioEl = document.getElementById("calendario");

    if (calendarioEl) {

        const calendario = new FullCalendar.Calendar(calendarioEl, {

            locale: "pt-br",

            initialView: "dayGridMonth",

            height: 650,

            headerToolbar: {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay"
            },

            buttonText: {
                today: "Hoje",
                month: "Mês",
                week: "Semana",
                day: "Dia"
            },

            events: eventos,

            eventClick: function (info) {

                const props = info.event.extendedProps;

                let mensagem =
                    "Agendamento\n\n" +
                    "Serviço: " + info.event.title + "\n" +
                    "Cliente: " + (props.cliente || "---") + "\n" +
                    "Telefone: " + (props.telefone || "---") + "\n" +
                    "Funcionário: " + (props.funcionario || props.profissional || "---") + "\n" +
                    "Status: " + (props.status || "---") + "\n" +
                    "Observação: " + (props.observacao || "---") +
                    "\n\nDigite:\n1 - Concluir serviço\n2 - Excluir agendamento\nCancelar - Fechar";

                let acao = prompt(mensagem);

                if (acao === "1") {

                    if (props.status === "Finalizado") {
                        alert("Este serviço já está finalizado.");
                        return;
                    }

                    fetch("/servico/agendamento/concluir", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            id: info.event.id
                        })
                    })
                    .then(function (resposta) {
                        return resposta.json();
                    })
                    .then(function (corpo) {
                        alert(corpo.msg);

                        if (corpo.ok) {
                            window.location.reload();
                        }
                    })
                    .catch(function (erro) {
                        console.error("ERRO AO CONCLUIR AGENDAMENTO:", erro);
                        alert("Erro ao concluir agendamento.");
                    });
                }

                if (acao === "2") {

                    if (props.status === "Finalizado") {
                        alert("Não é possível excluir um agendamento finalizado.");
                        return;
                    }

                    if (!confirm("Deseja realmente excluir este agendamento?")) {
                        return;
                    }

                    fetch("/servico/agendamento/deletar", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            id: info.event.id
                        })
                    })
                    .then(function (resposta) {
                        return resposta.json();
                    })
                    .then(function (corpo) {
                        alert(corpo.msg);

                        if (corpo.ok) {
                            window.location.reload();
                        }
                    })
                    .catch(function (erro) {
                        console.error("ERRO AO EXCLUIR AGENDAMENTO:", erro);
                        alert("Erro ao excluir agendamento.");
                    });
                }
            }
        });

        calendario.render();
    }

    const btnAgendar = document.getElementById("btnAgendar");

    if (btnAgendar) {

        btnAgendar.addEventListener("click", function () {

            const cliente = document.getElementById("cliente");
            const telefone = document.getElementById("telefone");
            const servico = document.getElementById("servico");
            const profissional = document.getElementById("profissional");
            const data = document.getElementById("data");
            const hora = document.getElementById("hora");
            const observacao = document.getElementById("observacao");

            if (
                !cliente.value.trim() ||
                !servico.value ||
                !profissional.value ||
                !data.value ||
                !hora.value
            ) {
                alert("Preencha os campos obrigatórios.");
                return;
            }

            const dataHoraSelecionada = new Date(data.value + "T" + hora.value);
            const agora = new Date();

            if (dataHoraSelecionada <= agora) {
                alert("Não é possível agendar para data ou horário que já passou.");
                return;
            }

            fetch("/servico/agendar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cliente: cliente.value.trim(),
                    telefone: telefone.value.trim(),
                    servico: servico.value,
                    profissional: profissional.value,
                    data: data.value,
                    hora: hora.value,
                    observacao: observacao.value.trim()
                })
            })
            .then(function (resposta) {
                return resposta.json();
            })
            .then(function (corpo) {
                alert(corpo.msg);

                if (corpo.ok) {
                    window.location.reload();
                }
            })
            .catch(function (erro) {
                console.error("ERRO AO AGENDAR:", erro);
                alert("Erro ao realizar agendamento.");
            });
        });
    }
});