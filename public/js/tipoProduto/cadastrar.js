document.addEventListener("DOMContentLoaded", function() {

    let btn = document.getElementById("btnGravar");

    btn.addEventListener("click", function() {
        let descricao = document.getElementById("descricao");
        let ativo = document.getElementById("ativo");

        descricao.style.borderColor = "#ced4da";

        if (descricao.value.trim() === "") {
            descricao.style.borderColor = "red";
            alert("Informe a descrição.");
            return;
        }

        fetch("/tipoproduto/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
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