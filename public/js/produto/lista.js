document.addEventListener("DOMContentLoaded", function() {

    let btns = document.querySelectorAll(".btnExcluir");

    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function() {
            let id = this.dataset.id;

            if (confirm("Tem certeza que deseja excluir o produto?")) {
                fetch("/produtos/deletar", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ id: id })
                })
                .then(resposta => resposta.json())
                .then(corpo => {
                    alert(corpo.msg);
                    if (corpo.ok) {
                        window.location.reload();
                    }
                })
                .catch(erro => {
                    console.error(erro);
                    alert("Erro ao excluir produto.");
                });
            }
        });
    }
});