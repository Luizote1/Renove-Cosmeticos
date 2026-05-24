document.addEventListener("DOMContentLoaded", function() {
  
    let btn = document.getElementById("btnGravar");

    btn.addEventListener("click", gravar);

    function gravar() {
        
        let inputNome = document.getElementById("nome");
        inputNome.style.borderColor = "#ced4da";
        let inputEmail = document.getElementById("email");
        inputEmail.style.borderColor = "#ced4da";
        let inputSenha = document.getElementById("senha");
        inputSenha.style.borderColor = "#ced4da";
        let selectPerfil = document.getElementById("perfil");
        selectPerfil.style.borderColor = "#ced4da";
        let cbAtivo = document.getElementById("ativo");

        //validação dos campos
        let listaValidacao = [];
        if(inputNome.value == "")
            listaValidacao.push("nome");
        if(inputEmail.value == "")
            listaValidacao.push("email");
        if(inputSenha.value == "")
            listaValidacao.push("senha");
        if(selectPerfil.value == "0")
            listaValidacao.push("perfil");
    
        if(listaValidacao.length == 0) {
            //segue com o envio dos dados para o backend
            fetch("/usuario/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: inputNome.value,
                    email: inputEmail.value,
                    senha: inputSenha.value,
                    perfil: selectPerfil.value,
                    ativo: cbAtivo.checked
                })
            })
            .then(function(resposta) {
                return resposta.json();
            })
            .then(function(corpo) {
                if(corpo.ok) {
                    alert(corpo.msg);
                    //redireciona
                    window.location.href = "/usuario";
                }
                else {
                    alert(corpo.msg);
                }


            }) 
        }
        else {
            //exibe a validação através da lista;
            //trocar a cor da borda dos campos
            for(let i =0; i<listaValidacao.length; i++) {
                let campo = document.getElementById(listaValidacao[i]);
                campo.style.borderColor = "red";
            }
            alert("Alguns campos não foram preenchidos corretamente, confira!");
        }
    }
})