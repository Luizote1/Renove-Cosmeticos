document.addEventListener("DOMContentLoaded", function () {

    const btns = document.querySelectorAll(".btnExcluir");

    btns.forEach(function (btn) {

        btn.addEventListener("click", function () {

            const codigo = this.dataset.codigo;

            if (!codigo) {
                alert("Código do produto não encontrado no botão.");
                return;
            }

            if (!confirm("Tem certeza que deseja excluir este produto?")) {
                return;
            }

            fetch("/produtos/deletar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    codigo: codigo
                })
            })
            .then(function (resposta) {
                return resposta.json();
            })
            .then(function (corpo) {
                alert(corpo.msg);

                if (corpo.ok) {
                    window.location.reload();
                }
            })
            .catch(function (erro) {
                console.error("ERRO AO EXCLUIR PRODUTO:", erro);
                alert("Erro ao excluir produto.");
            });

        });

    });

});