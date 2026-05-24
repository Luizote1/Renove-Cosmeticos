document.addEventListener("DOMContentLoaded", function () {

    let btnAbrirAgendamento = document.getElementById("btnAbrirAgendamento");

    if (btnAbrirAgendamento) {
        btnAbrirAgendamento.addEventListener("click", function () {
            let modalEl = document.getElementById("modalAgendamento");
            let modal = new bootstrap.Modal(modalEl);
            modal.show();
        });
    }

    //-------------------------
    // EXCLUIR
    //-------------------------

    let btns = document.querySelectorAll(".btnExcluir");

    for (let i = 0; i < btns.length; i++) {

        btns[i].addEventListener("click", function () {

            let id = this.dataset.id;

            if (confirm("Deseja excluir este serviço?")) {

                fetch("/servico/deletar", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: id
                    })
                })
                    .then(r => r.json())
                    .then(c => {

                        alert(c.msg);

                        if (c.ok) {
                            window.location.reload();
                        }

                    });

            }

        });

    }


    //-------------------------
    // EVENTOS CALENDÁRIO
    //-------------------------

    let eventos = [];

    let eventosInput = document.getElementById("eventosJson");

    if (eventosInput) {

        try {

            eventos = JSON.parse(eventosInput.value);

        }
        catch (e) {

            console.log("Erro JSON:", e);

        }

    }


    //-------------------------
    // CALENDÁRIO
    //-------------------------

    let calendarioEl = document.getElementById("calendario");

    if (calendarioEl) {

        let calendario = new FullCalendar.Calendar(calendarioEl, {

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

            events: eventos

        });

        calendario.render();

    }


    //-------------------------
    // AGENDAR
    //-------------------------

    let btnAgendar = document.getElementById("btnAgendar");

    if (btnAgendar) {

        btnAgendar.addEventListener("click", function () {

            let cliente = document.getElementById("cliente");
            let telefone = document.getElementById("telefone");
            let servico = document.getElementById("servico");
            let profissional = document.getElementById("profissional");
            let data = document.getElementById("data");
            let hora = document.getElementById("hora");
            let observacao = document.getElementById("observacao");

            let validacao = [];

            if (cliente.value == "")
                validacao.push("cliente");

            if (servico.value == "")
                validacao.push("servico");

            if (profissional.value == "")
                validacao.push("profissional");

            if (data.value == "")
                validacao.push("data");

            if (hora.value == "")
                validacao.push("hora");


            if (validacao.length == 0) {

                fetch("/servico/agendar", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        cliente: cliente.value,
                        telefone: telefone.value,
                        servico: servico.value,
                        profissional: profissional.value,
                        data: data.value,
                        hora: hora.value,
                        observacao: observacao.value

                    })

                })
                    .then(r => r.json())
                    .then(c => {

                        alert(c.msg);

                        if (c.ok) {

                            window.location.reload();

                        }

                    });

            }
            else {

                alert("Preencha os campos obrigatórios.");

            }

        });

    }

});