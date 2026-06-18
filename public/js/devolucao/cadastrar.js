document.addEventListener("DOMContentLoaded", function () {

    let btnGravar = document.getElementById("btnGravar");

    btnGravar.addEventListener("click", function () {

        let pedido = document.getElementById("pedido");
        let motivo = document.getElementById("motivo");
        let observacao = document.getElementById("observacao");

        pedido.style.borderColor = "#ced4da";
        motivo.style.borderColor = "#ced4da";

        let erros = [];

        if (pedido.value == "") {
            erros.push(pedido);
        }

        if (motivo.value == "") {
            erros.push(motivo);
        }

        if (erros.length > 0) {
            for (let i = 0; i < erros.length; i++) {
                erros[i].style.borderColor = "red";
            }

            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        fetch("/devolucao/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pedido: pedido.value,
                motivo: motivo.value,
                observacao: observacao.value
            })
        })
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (corpo) {
            alert(corpo.msg);

            if (corpo.ok) {
                window.location.href = "/devolucao";
            }
        })
        .catch(function (erro) {
            console.error("ERRO AO REGISTRAR DEVOLUÇÃO:", erro);
            alert("Erro interno ao registrar devolução.");
        });

    });

});