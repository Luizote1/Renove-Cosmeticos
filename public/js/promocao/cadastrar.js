document.addEventListener("DOMContentLoaded", function() {

    let btn = document.getElementById("btnGravar");

    btn.addEventListener("click", function() {

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

        if (produto.value == "") listaValidacao.push("produto");
        if (desconto.value == "" || desconto.value <= 0) listaValidacao.push("desconto");
        if (dataInicio.value == "") listaValidacao.push("dataInicio");
        if (dataFim.value == "") listaValidacao.push("dataFim");

        if (listaValidacao.length == 0) {

            fetch("/promocao/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    produto: produto.value,
                    desconto: desconto.value,
                    dataInicio: dataInicio.value,
                    dataFim: dataFim.value,
                    ativo: ativo.checked ? "s" : "n"
                })
            })
            .then(r => r.json())
            .then(c => {
                alert(c.msg);

                if (c.ok) {
                    window.location.href = "/promocao";
                }
            });

        } else {
            for (let i = 0; i < listaValidacao.length; i++) {
                document.getElementById(listaValidacao[i]).style.borderColor = "red";
            }

            alert("Preencha os campos obrigatórios corretamente.");
        }
    });
});