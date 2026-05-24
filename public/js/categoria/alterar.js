document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btnAlterar").addEventListener("click", () => {

        fetch("/categoria/alterar", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                id: document.getElementById("id").value,
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