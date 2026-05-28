document.addEventListener("DOMContentLoaded", function () {

    const btnGravar =
        document.getElementById("btnGravar");

    btnGravar.addEventListener("click", function () {

        const descricao =
            document.getElementById("descricao");

        const detalhes =
            document.getElementById("detalhes");

        const valor =
            document.getElementById("valor");

        const duracao =
            document.getElementById("duracao");

        const cor =
            document.getElementById("cor");

        const ativo =
            document.getElementById("ativo");


        //-------------------------
        // RESETAR BORDAS
        //-------------------------

        descricao.style.borderColor = "";
        valor.style.borderColor = "";
        duracao.style.borderColor = "";
        cor.style.borderColor = "";


        //-------------------------
        // VALIDAÇÃO
        //-------------------------

        let erros = [];

        if (descricao.value.trim() == "") {
            erros.push(descricao);
        }

        if (
            valor.value == "" ||
            Number(valor.value) < 0
        ) {
            erros.push(valor);
        }

        if (
            duracao.value == "" ||
            Number(duracao.value) <= 0
        ) {
            erros.push(duracao);
        }

        if (cor.value == "") {
            erros.push(cor);
        }


        //-------------------------
        // CAMPOS INVÁLIDOS
        //-------------------------

        if (erros.length > 0) {

            erros.forEach(function (campo) {
                campo.style.borderColor = "red";
            });

            alert(
                "Preencha corretamente os campos obrigatórios."
            );

            return;
        }


        //-------------------------
        // ENVIAR
        //-------------------------

        fetch("/servico/cadastrar", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                descricao:
                    descricao.value.trim(),

                detalhes:
                    detalhes.value.trim(),

                valor:
                    valor.value,

                duracao:
                    duracao.value,

                cor:
                    cor.value,

                ativo:
                    ativo.checked ? "s" : "n"

            })

        })
        .then(function (resposta) {

            return resposta.json();

        })
        .then(function (corpo) {

            alert(corpo.msg);

            if (corpo.ok) {

                window.location.href =
                    "/servico";

            }

        })
        .catch(function (erro) {

            console.error(
                "ERRO AO CADASTRAR SERVIÇO:",
                erro
            );

            alert(
                "Erro interno ao cadastrar serviço."
            );

        });

    });

});