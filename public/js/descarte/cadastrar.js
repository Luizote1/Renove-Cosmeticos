document.addEventListener("DOMContentLoaded", function () {

    let btn = document.getElementById("btnGravar");

    btn.addEventListener("click", function () {

        let produto = document.getElementById("produto");
        let quantidade = document.getElementById("quantidade");
        let motivo = document.getElementById("motivo");
        let observacao = document.getElementById("observacao");

        produto.style.borderColor = "#ced4da";
        quantidade.style.borderColor = "#ced4da";
        motivo.style.borderColor = "#ced4da";

        let listaValidacao = [];

        let qtd = Number(quantidade.value);

        if (produto.value == "") listaValidacao.push("produto");

        if (
            quantidade.value == "" ||
            !Number.isInteger(qtd) ||
            qtd <= 0
        ) {
            listaValidacao.push("quantidade");
        }

        if (motivo.value == "") listaValidacao.push("motivo");

        if (listaValidacao.length == 0) {

            fetch("/descarte/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    produto: produto.value,
                    quantidade: quantidade.value,
                    motivo: motivo.value,
                    observacao: observacao.value
                })
            })
            .then(r => r.json())
            .then(c => {
                alert(c.msg);

                if (c.ok) {
                    window.location.href = "/descarte";
                }
            });

        } else {
            for (let i = 0; i < listaValidacao.length; i++) {
                document.getElementById(listaValidacao[i]).style.borderColor = "red";
            }

            alert("Preencha corretamente. A quantidade deve ser um número inteiro maior que zero.");
        }
    });
});