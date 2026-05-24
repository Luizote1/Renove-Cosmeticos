document.addEventListener("DOMContentLoaded", function () {

    const input = document.getElementById("emailCpf");
    const form = document.getElementById("formLogin");
    const toggle = document.getElementById("toggleSenha");
    const senha = document.getElementById("senha");

    // MÁSCARA CPF AUTOMÁTICA
    input.addEventListener("input", function () {
        let valorOriginal = input.value;

        // se tiver letra ou @, trata como email e não aplica máscara
        if (/[a-zA-Z@]/.test(valorOriginal)) {
            return;
        }

        let valor = valorOriginal.replace(/\D/g, "").substring(0, 11);

        if (valor.length > 9) {
            valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
        } else if (valor.length > 6) {
            valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
        } else if (valor.length > 3) {
            valor = valor.replace(/(\d{3})(\d{1,3})/, "$1.$2");
        }

        input.value = valor;
    });

    // VALIDAÇÃO NO SUBMIT
    form.addEventListener("submit", function (e) {
        let emailCpf = document.getElementById("emailCpf");
        let senha = document.getElementById("senha");

        let emailCpfError = document.getElementById("emailCpfError");
        let senhaError = document.getElementById("senhaError");

        let valido = true;

        emailCpf.style.borderColor = "#ced4da";
        senha.style.borderColor = "#ced4da";
        emailCpfError.style.display = "none";
        senhaError.style.display = "none";

        let valor = emailCpf.value.trim();
        let cpfLimpo = valor.replace(/\D/g, "");

        let emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
        let cpfValido = cpfLimpo.length === 11;

        if (!emailValido && !cpfValido) {
            emailCpf.style.borderColor = "red";
            emailCpfError.style.display = "block";
            valido = false;
        }

        if (senha.value.trim() === "") {
            senha.style.borderColor = "red";
            senhaError.style.display = "block";
            valido = false;
        }

        if (!valido) {
            e.preventDefault();
        }
    });

    // MOSTRAR/OCULTAR SENHA
    toggle.addEventListener("click", function () {
        senha.type = senha.type === "password" ? "text" : "password";
    });
});