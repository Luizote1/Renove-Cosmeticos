document.addEventListener("DOMContentLoaded", function() {

    let btn = document.getElementById("btnAlterar");

    btn.addEventListener("click", function() {

        let id = document.getElementById("id");
        let nome = document.getElementById("nome");
        let telefone = document.getElementById("telefone");
        let email = document.getElementById("email");
        let ativo = document.getElementById("ativo");

        nome.style.borderColor = "#ced4da";
        telefone.style.borderColor = "#ced4da";
        email.style.borderColor = "#ced4da";

        let listaValidacao = [];

        if (nome.value == "") listaValidacao.push("nome");

        if (listaValidacao.length == 0) {
            fetch("/laboratorio/alterar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id.value,
                    nome: nome.value,
                    telefone: telefone.value,
                    email: email.value,
                    ativo: ativo.checked
                })
            })
            .then(r => r.json())
            .then(c => {
                alert(c.msg);
                if (c.ok) {
                    window.location.href = "/laboratorio";
                }
            });
        } else {
            for (let i = 0; i < listaValidacao.length; i++) {
                document.getElementById(listaValidacao[i]).style.borderColor = "red";
            }

            alert("Preencha os campos corretamente.");
        }
    });
});