document.addEventListener("DOMContentLoaded", function() {

    let btns = document.querySelectorAll(".btnExcluir");

    btns.forEach(btn => {
        btn.addEventListener("click", function() {
            let id = this.dataset.id;

            if(confirm("Excluir tipo?")) {
                fetch("/tipoproduto/excluir", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({id})
                })
                .then(r => r.json())
                .then(c => {
                    alert(c.msg);
                    if(c.ok) location.reload();
                });
            }
        });
    });
});