document.addEventListener("DOMContentLoaded", function () {

    let btns = document.querySelectorAll(".btnExcluir");

    for (let i = 0; i < btns.length; i++) {

        btns[i].addEventListener("click", function () {

            alert(
                "Não é possível excluir uma devolução, pois ela faz parte do histórico de movimentação de estoque."
            );

        });

    }

});