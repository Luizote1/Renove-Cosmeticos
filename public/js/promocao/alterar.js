document.addEventListener("DOMContentLoaded", function () {

    let btn = document.getElementById("btnAlterar");

    btn.addEventListener("click", function () {

        let id = document.getElementById("id");
        let produto = document.getElementById("produto");
        let desconto = document.getElementById("desconto");
        let dataInicio = document.getElementById("dataInicio");
        let dataFim = document.getElementById("dataFim");
        let ativo = document.getElementById("ativo");

        produto.style.borderColor = "#ced4da";
        desconto.style.borderColor = "#ced4da";
        dataInicio.style.borderColor = "#ced4da";
        dataFim.style.borderColor = "#ced4da";

        let listaValidacao = [];

        if (id.value == "") listaValidacao.push("id");
        if (produto.value == "") listaValidacao.push("produto");
        if (desconto.value == "" || Number(desconto.value) <= 0 || Number(desconto.value) > 100) listaValidacao.push("desconto");
        if (dataInicio.value == "") listaValidacao.push("dataInicio");
        if (dataFim.value == "") listaValidacao.push("dataFim");

        if (listaValidacao.length > 0) {
            for (let i = 0; i < listaValidacao.length; i++) {
                document.getElementById(listaValidacao[i]).style.borderColor = "red";
            }

            alert("Preencha os campos obrigatórios corretamente. O desconto deve ser entre 1 e 100%.");
            return;
        }

        let hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        let inicio = new Date(dataInicio.value + "T00:00:00");
        let fim = new Date(dataFim.value + "T00:00:00");

        if (inicio < hoje || fim < hoje) {
            dataInicio.style.borderColor = "red";
            dataFim.style.borderColor = "red";
            alert("Não é possível usar datas anteriores ao dia atual.");
            return;
        }

        if (fim < inicio) {
            dataFim.style.borderColor = "red";
            alert("A data final não pode ser menor que a data inicial.");
            return;
        }

        fetch("/promocao/alterar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id.value,
                produto: produto.value,
                desconto: desconto.value,
                dataInicio: dataInicio.value,
                dataFim: dataFim.value,
                ativo: ativo.checked ? "s" : "n"
            })
        })
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (corpo) {
            alert(corpo.msg);

            if (corpo.ok) {
                window.location.href = "/promocao";
            }
        })
        .catch(function (erro) {
            console.error("ERRO AO ALTERAR PROMOÇÃO:", erro);
            alert("Erro interno ao alterar promoção.");
        });

    });

});