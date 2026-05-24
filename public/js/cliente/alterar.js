document.addEventListener("DOMContentLoaded", function() {

    let btn = document.getElementById("btnAlterar");

    btn.addEventListener("click", function() {

        let id = document.getElementById("id");
        let nome = document.getElementById("nome");
        let cpf = document.getElementById("cpf");
        let nascimento = document.getElementById("nascimento");
        let genero = document.getElementById("genero");
        let telefone = document.getElementById("telefone");
        let email = document.getElementById("email");
        let senha = document.getElementById("senha");
        let ativo = document.getElementById("ativo");

        nome.style.borderColor = "#ced4da";
        cpf.style.borderColor = "#ced4da";
        nascimento.style.borderColor = "#ced4da";
        genero.style.borderColor = "#ced4da";
        telefone.style.borderColor = "#ced4da";
        email.style.borderColor = "#ced4da";
        senha.style.borderColor = "#ced4da";

        let listaValidacao = [];

        if (nome.value == "") listaValidacao.push("nome");
        if (cpf.value == "") listaValidacao.push("cpf");
        if (nascimento.value == "") listaValidacao.push("nascimento");
        if (genero.value == "") listaValidacao.push("genero");
        if (telefone.value == "") listaValidacao.push("telefone");
        if (email.value == "") listaValidacao.push("email");
        if (senha.value == "") listaValidacao.push("senha");

        if (listaValidacao.length == 0) {
            fetch("/cliente/alterar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id.value,
                    nome: nome.value,
                    cpf: cpf.value,
                    nascimento: nascimento.value,
                    genero: genero.value,
                    telefone: telefone.value,
                    email: email.value,
                    senha: senha.value,
                    ativo: ativo.checked ? "s" : "n"
                })
            })
            .then(r => r.json())
            .then(c => {
                alert(c.msg);
                if (c.ok) {
                    window.location.href = "/cliente";
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