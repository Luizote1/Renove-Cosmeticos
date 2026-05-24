document.addEventListener("DOMContentLoaded", function() {

    let btn = document.getElementById("btnGravar");

    btn.addEventListener("click", function() {

        let descricao = document.getElementById("descricao");
        let detalhes = document.getElementById("detalhes");
        let valor = document.getElementById("valor");
        let duracao = document.getElementById("duracao");
        let cor = document.getElementById("cor");
        let ativo = document.getElementById("ativo");

        descricao.style.borderColor = "#ced4da";
        valor.style.borderColor = "#ced4da";
        duracao.style.borderColor = "#ced4da";
        cor.style.borderColor = "#ced4da";

        let listaValidacao = [];

        if (descricao.value == "") listaValidacao.push("descricao");
        if (valor.value == "") listaValidacao.push("valor");
        if (duracao.value == "") listaValidacao.push("duracao");
        if (cor.value == "") listaValidacao.push("cor");

        if (listaValidacao.length == 0) {

            fetch("/servico/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    descricao: descricao.value,
                    detalhes: detalhes.value,
                    valor: valor.value,
                    duracao: duracao.value,
                    cor: cor.value,
                    ativo: ativo.checked ? "s" : "n"
                })
            })
            .then(r => r.json())
            .then(c => {
                alert(c.msg);

                if (c.ok) {
                    window.location.href = "/servico";
                }
            });

        } else {

            for (let i = 0; i < listaValidacao.length; i++) {
                document.getElementById(listaValidacao[i]).style.borderColor = "red";
            }

            alert("Alguns campos não foram preenchidos corretamente, confira!");
        }
    });
});