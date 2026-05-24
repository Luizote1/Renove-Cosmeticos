document.addEventListener("DOMContentLoaded", function() {

    let btns = document.querySelectorAll(".btnExcluir");

    for (let i = 0; i < btns.length; i++) {

        btns[i].addEventListener("click", function() {

            let id = this.dataset.id;

            if (confirm("Deseja excluir este descarte?")) {

                fetch("/descarte/deletar", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: id
                    })
                })
                .then(r => r.json())
                .then(c => {
                    alert(c.msg);

                    if (c.ok) {
                        window.location.reload();
                    }
                });
            }
        });
    }
});2