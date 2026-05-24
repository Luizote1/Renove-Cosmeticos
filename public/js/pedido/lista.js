document.addEventListener("DOMContentLoaded", function () {
    const btnBuscar = document.getElementById("btnBuscar");

    if (btnBuscar) {
        btnBuscar.addEventListener("click", buscarPedidos);
    }

    buscarPedidos();
});

async function buscarPedidos() {
    let busca = document.getElementById("txtBusca").value;

    let resposta = await fetch("/pedido/listar?busca=" + encodeURIComponent(busca));
    let lista = await resposta.json();

    let tbody = document.querySelector("#tabelaPedidos tbody");

    tbody.innerHTML = "";

    if (lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center text-muted">
                    Nenhum pedido encontrado.
                </td>
            </tr>
        `;
        return;
    }

    for (let item of lista) {
        let linha = document.createElement("tr");

        linha.innerHTML = `
            <td>#${item.pedidoId}</td>
            <td>${formatarData(item.pedidoData)}</td>
            <td>${item.itemNome}</td>
            <td>${item.itemQuantidade}</td>
            <td>R$ ${Number(item.itemValor).toFixed(2).replace(".", ",")}</td>
            <td>R$ ${Number(item.itemValorTotal).toFixed(2).replace(".", ",")}</td>
            <td>R$ ${Number(item.pedidoValor).toFixed(2).replace(".", ",")}</td>
            <td>${item.pedidoPagamento || "Não informado"}</td>
            <td>
                <span class="badge bg-success">
                    ${item.pedidoStatus || "Realizado"}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="imprimirPedido(${item.pedidoId})">
                    Imprimir
                </button>
            </td>
        `;

        tbody.appendChild(linha);
    }
}

function imprimirPedido(id) {
    window.open("/pedido/imprimir/" + id, "_blank");
}

function formatarData(data) {
    if (!data) return "-";

    let d = new Date(data);

    if (isNaN(d.getTime())) return data;

    return d.toLocaleDateString("pt-BR");
}