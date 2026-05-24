document.addEventListener("DOMContentLoaded", function(){

    var btnGravar = document.getElementById("btnAlterar");

    btnGravar.addEventListener("click", alterarProduto);

    let inputArquivo = document.getElementById("inputImagem");
    inputArquivo.addEventListener("change", carregarPrevia);
});

function carregarPrevia() {
    console.log(this.files);

    if(this.files.length > 0) {
        let img = document.getElementById("previaImagem");
        let urlImg = URL.createObjectURL(this.files[0]);
        img.src = urlImg;
        document.getElementById("divPrevia").style.display = "block";
    }
}

function alterarProduto() {

    var inputCodigoAtual = document.getElementById("inputCodigoAtual");
    var inputCodigo = document.getElementById("inputCodigo");
    var inputNome = document.getElementById("inputNome");
    var inputDescricao = document.getElementById("inputDescricao");
    var inputPreco = document.getElementById("inputPreco");
    var inputEstoque = document.getElementById("inputEstoque");
    var inputValidade = document.getElementById("inputValidade");
    var selAtivo = document.getElementById("selAtivo");
    var selCategoria = document.getElementById("selCategoria");
    var selTipo = document.getElementById("selTipo");
    var selLaboratorio = document.getElementById("selLaboratorio");
    var inputImagem = document.getElementById("inputImagem");

    if(
        inputCodigo.value != "" &&
        inputNome.value != "" &&
        inputEstoque.value != "" &&
        inputEstoque.value != '0' &&
        selCategoria.value != '0' &&
        selTipo.value != '0' &&
        selLaboratorio.value != '0' &&
        inputPreco.value != ""
    ){

        let formData = new FormData();

        formData.append("codigoAtual", inputCodigoAtual.value);
        formData.append("codigo", inputCodigo.value);
        formData.append("nome", inputNome.value);
        formData.append("descricao", inputDescricao.value);
        formData.append("preco", inputPreco.value);
        formData.append("estoque", inputEstoque.value);
        formData.append("validade", inputValidade.value);
        formData.append("ativo", selAtivo.value);
        formData.append("categoria", selCategoria.value);
        formData.append("tipo", selTipo.value);
        formData.append("laboratorio", selLaboratorio.value);

        if(inputImagem.files.length > 0) {
            formData.append("imagem", inputImagem.files[0]);
        }

        fetch('/produtos/alterar', {
            method: "POST",
            body: formData
        })
        .then(r => {
            return r.json();
        })
        .then(r => {
            if(r.ok) {
                alert("Produto alterado!");
                window.location.href = "/produtos/listar";
            }
            else{
                alert("Erro ao alterar produto");
            }
        })
        .catch(e => {
            console.log(e);
        });

    }
    else{
        alert("Preencha todos os campos corretamente!");
        return;
    }
}