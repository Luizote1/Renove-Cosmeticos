document.addEventListener("DOMContentLoaded", function () {
    const botoes = document.querySelectorAll(".btnExcluir");

    for (let i = 0; i < botoes.length; i++) {
        botoes[i].addEventListener("click", async function () {
            const id = this.dataset.id;

            if (!confirm("Deseja excluir o laboratório?")) {
                return;
            }

            try {
                const resposta = await fetch("/laboratorio/excluir", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ id: id })
                });

                const corpo = await resposta.json();
                alert(corpo.msg);

                if (corpo.ok) {
                    window.location.reload();
                }
            } catch (erro) {
                console.error(erro);
                alert("Erro ao excluir laboratório.");
            }
        });
    }
});