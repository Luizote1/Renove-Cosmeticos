document.addEventListener("DOMContentLoaded", function () {

    let pedido = document.getElementById("pedido");

    pedido.addEventListener("change", async function () {

        let produto = document.getElementById("produto");

        produto.innerHTML =
            '<option value="">Carregando...</option>';

        let resposta =
            await fetch("/devolucao/itens-pedido/" + pedido.value);

        let dados = await resposta.json();

        produto.innerHTML =
            '<option value="">Selecione</option>';

        for (let i = 0; i < dados.itens.length; i++) {

            let item = dados.itens[i];

            produto.innerHTML += `
                <option value="${item.pro_codigo}">
                    ${item.pro_nome}
                    (Qtd Comprada: ${item.pit_quantidade})
                </option>
            `;
        }
    });

    document
        .getElementById("btnGravar")
        .addEventListener("click", async function () {

            let pedido =
                document.getElementById("pedido").value;

            let produto =
                document.getElementById("produto").value;

            let quantidade =
                document.getElementById("quantidade").value;

            let motivo =
                document.getElementById("motivo").value;

            let observacao =
                document.getElementById("observacao").value;

            let resposta =
                await fetch("/devolucao/cadastrar", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        pedido,
                        produto,
                        quantidade,
                        motivo,
                        observacao
                    })
                });

            let dados =
                await resposta.json();

            alert(dados.msg);

            if (dados.ok) {

                window.location.href =
                    "/devolucao";
            }
        });
});