document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btnGravar").addEventListener("click", () => {

        fetch("/categoria/cadastrar", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                descricao: document.getElementById("descricao").value,
                ativo: document.getElementById("ativo").checked
            })
        })
        .then(r => r.json())
        .then(c => {
            alert(c.msg);
            if(c.ok) window.location.href = "/categoria";
        });
    });
});