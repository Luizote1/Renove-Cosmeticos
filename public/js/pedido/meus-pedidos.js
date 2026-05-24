document.addEventListener("DOMContentLoaded", function () {
    carregarPedidos();
});

async function carregarPedidos() {
    let resposta = await fetch("/pedido/meus-pedidos/listar");
    let lista = await resposta.json();

    let tbody = document.querySelector("#tabelaMeusPedidos tbody");

    tbody.innerHTML = "";

    if (lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center text-muted">
                    Nenhum pedido encontrado.
                </td>
            </tr>
        `;
        return;
    }

    for (let i = 0; i < lista.length; i++) {
        let linha = document.createElement("tr");

        linha.innerHTML = `
            <td>#${lista[i].pedidoId}</td>
            <td>${formatarData(lista[i].pedidoData)}</td>
            <td>${lista[i].itemNome}</td>
            <td>${lista[i].itemQuantidade}</td>
            <td>R$ ${Number(lista[i].itemValor).toFixed(2).replace(".", ",")}</td>
            <td>R$ ${Number(lista[i].itemValorTotal).toFixed(2).replace(".", ",")}</td>
            <td>R$ ${Number(lista[i].pedidoValor).toFixed(2).replace(".", ",")}</td>
            <td>${lista[i].pedidoPagamento || "Não informado"}</td>
            <td>
                <span class="badge bg-primary">
                    ${lista[i].pedidoStatus || "Realizado"}
                </span>
            </td>
        `;

        tbody.appendChild(linha);
    }
}

function formatarData(data) {
    if (!data) return "-";

    let d = new Date(data);

    if (isNaN(d.getTime())) return data;

    return d.toLocaleDateString("pt-BR");
}