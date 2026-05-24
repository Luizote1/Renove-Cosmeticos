document.addEventListener("DOMContentLoaded", function() {

    let btn = document.getElementById("btnAlterar");

    btn.addEventListener("click", function() {

        let id = document.getElementById("id");
        let produto = document.getElementById("produto");
        let quantidade = document.getElementById("quantidade");
        let data = document.getElementById("data");
        let motivo = document.getElementById("motivo");
        let observacao = document.getElementById("observacao");

        produto.style.borderColor = "#ced4da";
        quantidade.style.borderColor = "#ced4da";
        data.style.borderColor = "#ced4da";
        motivo.style.borderColor = "#ced4da";

        let listaValidacao = [];

        if (produto.value == "") listaValidacao.push("produto");
        if (quantidade.value == "" || quantidade.value <= 0) listaValidacao.push("quantidade");
        if (data.value == "") listaValidacao.push("data");
        if (motivo.value == "") listaValidacao.push("motivo");

        if (listaValidacao.length == 0) {

            fetch("/descarte/alterar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id.value,
                    produto: produto.value,
                    quantidade: quantidade.value,
                    data: data.value,
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

            alert("Preencha os campos obrigatórios corretamente.");
        }
    });
});