document.addEventListener("DOMContentLoaded", function () {

    let btn = document.getElementById("btnSalvarPerfil");

    if (!btn) return;

    btn.addEventListener("click", function () {

        let nome = document.getElementById("nome");
        let nascimento = document.getElementById("nascimento");
        let genero = document.getElementById("genero");
        let telefone = document.getElementById("telefone");

        nome.style.borderColor = "#ced4da";
        nascimento.style.borderColor = "#ced4da";
        genero.style.borderColor = "#ced4da";
        telefone.style.borderColor = "#ced4da";

        let listaValidacao = [];

        if (nome.value.trim() == "") listaValidacao.push("nome");
        if (nascimento.value.trim() == "") listaValidacao.push("nascimento");
        if (genero.value.trim() == "") listaValidacao.push("genero");
        if (telefone.value.trim() == "") listaValidacao.push("telefone");

        if (listaValidacao.length == 0) {

            fetch("/perfil/atualizar-cliente", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: nome.value,
                    nascimento: nascimento.value,
                    genero: genero.value,
                    telefone: telefone.value
                })
            })
            .then(r => r.json())
            .then(c => {
                alert(c.msg);

                if (c.ok) {
                    window.location.reload();
                }
            });

        } else {

            for (let i = 0; i < listaValidacao.length; i++) {
                document.getElementById(listaValidacao[i]).style.borderColor = "red";
            }

            alert("Preencha todos os campos obrigatórios.");
        }
    });
});