document.addEventListener("DOMContentLoaded", function() {

    let btn = document.getElementById("btnAlterar");

    btn.addEventListener("click", function() {
        let id = document.getElementById("id");
        let descricao = document.getElementById("descricao");
        let ativo = document.getElementById("ativo");

        descricao.style.borderColor = "#ced4da";

        if (descricao.value.trim() === "") {
            descricao.style.borderColor = "red";
            alert("Informe a descrição.");
            return;
        }

        fetch("/tipoproduto/alterar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id.value,
                descricao: descricao.value,
                ativo: ativo.checked
            })
        })
        .then(r => r.json())
        .then(corpo => {
            alert(corpo.msg);
            if (corpo.ok) {
                window.location.href = "/tipoproduto";
            }
        });
    });
});