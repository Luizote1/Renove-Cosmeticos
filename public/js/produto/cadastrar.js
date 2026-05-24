document.addEventListener("DOMContentLoaded", function(){

    var btnGravar = document.getElementById("btnGravar");

    btnGravar.addEventListener("click", gravarProduto);
});

function gravarProduto() {

    var codigo = document.getElementById("codigo");
    var nome = document.getElementById("nome");
    var descricao = document.getElementById("descricao");
    var preco = document.getElementById("preco");
    var estoque = document.getElementById("estoque");
    var validade = document.getElementById("validade");
    var ativo = document.getElementById("ativo");
    var categoria = document.getElementById("categoria");
    var tipo = document.getElementById("tipo");
    var laboratorio = document.getElementById("laboratorio");
    var imagem = document.getElementById("imagem");

    if(
        codigo.value != "" &&
        nome.value != "" &&
        estoque.value != "" &&
        estoque.value != "0" &&
        categoria.value != "" &&
        tipo.value != "" &&
        laboratorio.value != "" &&
        preco.value != ""
    ){

        let formData = new FormData();

        formData.append("codigo", codigo.value);
        formData.append("nome", nome.value);
        formData.append("descricao", descricao.value);
        formData.append("preco", preco.value);
        formData.append("estoque", estoque.value);
        formData.append("validade", validade.value);
        formData.append("ativo", ativo.checked ? "s" : "n");
        formData.append("categoria", categoria.value);
        formData.append("tipo", tipo.value);
        formData.append("laboratorio", laboratorio.value);

        if(imagem.files.length > 0) {
            formData.append("imagem", imagem.files[0]);
        }

        fetch("/produtos/cadastrar", {
            method: "POST",
            body: formData
        })
        .then(r => r.json())
        .then(r => {
            if(r.ok) {
                alert("Produto cadastrado!");
                window.location.href = "/produtos/listar";
            }
            else{
                alert("Erro ao cadastrar produto");
            }
        })
        .catch(e => {
            console.log(e);
            alert("Erro ao cadastrar produto");
        });

    }
    else{
        alert("Preencha todos os campos corretamente!");
        return;
    }
}