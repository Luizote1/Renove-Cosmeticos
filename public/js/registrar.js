let currentStep = 1;
let cpfExiste = false;
let emailExiste = false;

document.addEventListener("DOMContentLoaded", function () {
    updateProgress(1);
    configurarEventos();
    configurarDataNascimento();
});

function configurarEventos() {
    const cpf = document.getElementById("cpf");
    const nome = document.getElementById("nome");
    const nascimento = document.getElementById("nascimento");
    const genero = document.getElementById("genero");
    const telefone = document.getElementById("telefone");
    const email = document.getElementById("email");
    const termos = document.getElementById("termos");
    const senha = document.getElementById("senha");
    const confirmarSenha = document.getElementById("confirmarSenha");
    const btnCalendario = document.getElementById("btnCalendario");
    const nascimentoCalendario = document.getElementById("nascimentoCalendario");

    if (cpf) {
        cpf.addEventListener("input", function (e) {
            let v = e.target.value.replace(/\D/g, "").slice(0, 11);

            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

            e.target.value = v;

            cpfExiste = false;
            document.getElementById("cpfError").textContent = "Digite um CPF válido.";
            clearError("cpf", "cpfError");
        });

        cpf.addEventListener("blur", async function () {
            await validarCampoCpf();
        });
    }

    if (nome) {
        nome.addEventListener("input", function () {
            clearError("nome", "nomeError");
        });

        nome.addEventListener("blur", function () {
            validarCampoNome();
        });
    }

    if (nascimento) {
        nascimento.addEventListener("input", function (e) {
            let v = e.target.value.replace(/\D/g, "").slice(0, 8);

            if (v.length > 4) {
                v = v.replace(/(\d{2})(\d{2})(\d+)/, "$1/$2/$3");
            } else if (v.length > 2) {
                v = v.replace(/(\d{2})(\d+)/, "$1/$2");
            }

            e.target.value = v;
            clearError("nascimento", "nascimentoError");
        });

        nascimento.addEventListener("blur", function () {
            validarCampoNascimento();
        });
    }

    if (btnCalendario && nascimentoCalendario && nascimento) {
        btnCalendario.addEventListener("click", function () {

            // Chrome / Android
            if (nascimentoCalendario.showPicker) {
                try {
                    nascimentoCalendario.showPicker();
                    return;
                } catch (e) { }
            }

            // iPhone / Safari
            nascimentoCalendario.focus();
            nascimentoCalendario.click();

        });

        nascimentoCalendario.addEventListener("change", function () {
            if (!this.value) return;

            const partes = this.value.split("-");
            nascimento.value = `${partes[2]}/${partes[1]}/${partes[0]}`;

            validarCampoNascimento();
        });
    }

    if (genero) {
        genero.addEventListener("change", function () {
            validarCampoGenero();
        });

        genero.addEventListener("blur", function () {
            validarCampoGenero();
        });
    }

    if (telefone) {
        telefone.addEventListener("input", function (e) {
            let v = e.target.value.replace(/\D/g, "").slice(0, 11);

            v = v.replace(/(\d{2})(\d)/, "($1) $2");
            v = v.replace(/(\d{5})(\d{1,4})$/, "$1-$2");

            e.target.value = v;

            clearError("telefone", "telefoneError");
        });

        telefone.addEventListener("blur", function () {
            validarCampoTelefone();
        });
    }

    if (email) {
        email.addEventListener("input", function () {
            emailExiste = false;
            document.getElementById("emailError").textContent = "Digite um e-mail válido.";
            clearError("email", "emailError");
        });

        email.addEventListener("blur", async function () {
            await validarCampoEmail();
        });
    }

    if (termos) {
        termos.addEventListener("change", function () {
            validarCampoTermos();
        });
    }

    if (senha) {
        senha.addEventListener("input", function (e) {
            atualizarRegrasSenha(e.target.value);
            clearError("senha", "senhaError");
        });

        senha.addEventListener("blur", function () {
            validarCampoSenha(true);
        });
    }

    if (confirmarSenha) {
        confirmarSenha.addEventListener("input", function () {
            clearError("confirmarSenha", "confirmarSenhaError");
        });

        confirmarSenha.addEventListener("blur", function () {
            validarCampoConfirmarSenha();
        });
    }

    document.querySelectorAll(".toggle-pass").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const target = document.getElementById(btn.dataset.target);

            if (!target) return;

            target.type = target.type === "password" ? "text" : "password";

            const icon = btn.querySelector("i");

            if (icon) {
                icon.className = target.type === "password" ? "bi bi-eye" : "bi bi-eye-slash";
            }
        });
    });
}

function configurarDataNascimento() {
    const nascimentoCalendario = document.getElementById("nascimentoCalendario");

    if (!nascimentoCalendario) return;

    const hoje = new Date();

    const dataMaxima = new Date(
        hoje.getFullYear() - 18,
        hoje.getMonth(),
        hoje.getDate()
    );

    const ano = dataMaxima.getFullYear();
    const mes = String(dataMaxima.getMonth() + 1).padStart(2, "0");
    const dia = String(dataMaxima.getDate()).padStart(2, "0");

    nascimentoCalendario.min = "1930-01-01";
    nascimentoCalendario.max = `${ano}-${mes}-${dia}`;
}

function updateProgress(step) {
    const stepLabel = document.getElementById("stepLabel");
    const progress = document.querySelectorAll(".progress span");

    if (stepLabel) {
        stepLabel.textContent = `Passo ${step} de 2`;
    }

    progress.forEach(function (bar, index) {
        bar.classList.toggle("active", index < step);
    });
}

function goToStep(step) {
    currentStep = step;

    const steps = document.querySelectorAll(".step");

    steps.forEach(function (s) {
        s.classList.remove("active");
    });

    const atual = document.querySelector(`.step[data-step="${step}"]`);

    if (atual) {
        atual.classList.add("active");
    }

    updateProgress(step);
}

async function nextStep(step) {
    if (step === 1) {
        const ok = await validateStep1();

        if (!ok) return;

        goToStep(2);
        return;
    }

    if (step === 2) {
        if (!validateStep2()) return;

        await finalizarCadastro();
    }
}

function prevStep(step) {
    if (step > 1) {
        goToStep(step - 1);
    }
}

async function finalizarCadastro() {
    try {
        const cpf = document.getElementById("cpf").value.trim();
        const nome = document.getElementById("nome").value.trim();
        const nascimento = document.getElementById("nascimento").value.trim();
        const genero = document.getElementById("genero").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;

        const response = await fetch("/cadastro/gravar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cpf: onlyDigits(cpf),
                nome: nome,
                nascimento: converterDataParaMysql(nascimento),
                genero: genero,
                telefone: telefone,
                email: email,
                senha: senha
            })
        });

        const json = await response.json();

        alert(json.msg);

        if (json.ok) {
            window.location.href = "/";
        }

    } catch (erro) {
        console.log(erro);
        alert("Erro ao realizar cadastro.");
    }
}

async function verificarCadastroExistente(dados) {
    try {
        const response = await fetch("/cadastro/verificar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const json = await response.json();

        if (dados.cpf) {
            cpfExiste = json.existe;

            if (json.existe) {
                document.getElementById("cpfError").textContent = "Este CPF já está cadastrado.";
                showError("cpf", "cpfError");
            }
        }

        if (dados.email) {
            emailExiste = json.existe;

            if (json.existe) {
                document.getElementById("emailError").textContent = "Este e-mail já está cadastrado.";
                showError("email", "emailError");
            }
        }

    } catch (erro) {
        console.log("Erro ao verificar cadastro:", erro);
    }
}

async function validarCampoCpf() {
    const cpf = document.getElementById("cpf").value.trim();

    clearError("cpf", "cpfError");
    document.getElementById("cpfError").textContent = "Digite um CPF válido.";

    if (!isValidCPF(cpf)) {
        showError("cpf", "cpfError");
        return false;
    }

    await verificarCadastroExistente({
        cpf: onlyDigits(cpf)
    });

    return !cpfExiste;
}

function validarCampoNome() {
    const nome = document.getElementById("nome").value.trim();
    const partes = nome.split(/\s+/).filter(Boolean);

    clearError("nome", "nomeError");

    if (partes.length < 2 || nome.length < 6) {
        showError("nome", "nomeError");
        return false;
    }

    return true;
}

function validarCampoNascimento() {
    const nascimentoInput = document.getElementById("nascimento");
    const valor = nascimentoInput.value.trim();

    clearError("nascimento", "nascimentoError");

    if (!valor) {
        document.getElementById("nascimentoError").innerText =
            "Informe sua data de nascimento.";

        showError("nascimento", "nascimentoError");
        return false;
    }

    const partes = valor.split("/");

    if (partes.length !== 3) {
        document.getElementById("nascimentoError").innerText =
            "Use o formato dd/mm/aaaa.";

        showError("nascimento", "nascimentoError");
        return false;
    }

    const dia = Number(partes[0]);
    const mes = Number(partes[1]);
    const ano = Number(partes[2]);

    const birth = new Date(ano, mes - 1, dia);

    if (
        birth.getDate() !== dia ||
        birth.getMonth() !== mes - 1 ||
        birth.getFullYear() !== ano
    ) {
        document.getElementById("nascimentoError").innerText =
            "Data inválida.";

        showError("nascimento", "nascimentoError");
        return false;
    }

    const today = new Date();

    let idade = today.getFullYear() - birth.getFullYear();

    const ajuste =
        today.getMonth() < birth.getMonth() ||
        (
            today.getMonth() === birth.getMonth() &&
            today.getDate() < birth.getDate()
        );

    if (ajuste) {
        idade--;
    }

    if (idade < 18) {
        document.getElementById("nascimentoError").innerText =
            "Você deve ter pelo menos 18 anos.";

        showError("nascimento", "nascimentoError");
        return false;
    }

    if (idade > 95 || ano < 1930) {
        document.getElementById("nascimentoError").innerText =
            "Data de nascimento inválida.";

        showError("nascimento", "nascimentoError");
        return false;
    }

    clearError("nascimento", "nascimentoError");
    return true;
}

function validarCampoGenero() {
    const genero = document.getElementById("genero").value.trim();

    clearError("genero", "generoError");

    if (!genero) {
        showError("genero", "generoError");
        return false;
    }

    return true;
}

function validarCampoTelefone() {
    const telefone = document.getElementById("telefone").value.trim();

    clearError("telefone", "telefoneError");

    if (onlyDigits(telefone).length !== 11) {
        showError("telefone", "telefoneError");
        return false;
    }

    return true;
}

async function validarCampoEmail() {
    const email = document.getElementById("email").value.trim();

    clearError("email", "emailError");
    document.getElementById("emailError").textContent = "Digite um e-mail válido.";

    if (!isValidEmail(email)) {
        showError("email", "emailError");
        return false;
    }

    await verificarCadastroExistente({
        email: email
    });

    return !emailExiste;
}

function validarCampoTermos() {
    const termos = document.getElementById("termos").checked;

    clearError("termos", "termosError");

    if (!termos) {
        showError("termos", "termosError");
        return false;
    }

    return true;
}

function validarCampoSenha(mostrarErro) {
    const senha = document.getElementById("senha").value;

    const strong =
        senha.length >= 8 &&
        senha.length <= 25 &&
        /[0-9]/.test(senha) &&
        /[A-Z]/.test(senha) &&
        /[a-z]/.test(senha);

    if (mostrarErro) {
        clearError("senha", "senhaError");

        if (!strong) {
            showError("senha", "senhaError");
        }
    }

    return strong;
}

function validarCampoConfirmarSenha() {
    const senha = document.getElementById("senha").value;
    const confirmar = document.getElementById("confirmarSenha").value;

    clearError("confirmarSenha", "confirmarSenhaError");

    if (!confirmar || senha !== confirmar) {
        showError("confirmarSenha", "confirmarSenhaError");
        return false;
    }

    return true;
}

async function validateStep1() {
    const resultados = await Promise.all([
        validarCampoCpf(),
        Promise.resolve(validarCampoNome()),
        Promise.resolve(validarCampoNascimento()),
        Promise.resolve(validarCampoGenero()),
        Promise.resolve(validarCampoTelefone()),
        validarCampoEmail(),
        Promise.resolve(validarCampoTermos())
    ]);

    return resultados.every(Boolean);
}

function validateStep2() {
    let okSenha = validarCampoSenha(true);
    let okConfirmar = validarCampoConfirmarSenha();

    return okSenha && okConfirmar;
}

function showError(inputId, errorId, show = true) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    if (input) {
        input.classList.toggle("invalid", show);
    }

    if (error) {
        error.classList.toggle("show", show);
    }
}

function clearError(inputId, errorId) {
    showError(inputId, errorId, false);
}

function onlyDigits(value) {
    return String(value || "").replace(/\D/g, "");
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidCPF(cpf) {
    cpf = onlyDigits(cpf);

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }

    let sum = 0;

    for (let i = 0; i < 9; i++) {
        sum += Number(cpf[i]) * (10 - i);
    }

    let digit1 = (sum * 10) % 11;

    if (digit1 === 10) {
        digit1 = 0;
    }

    if (digit1 !== Number(cpf[9])) {
        return false;
    }

    sum = 0;

    for (let i = 0; i < 10; i++) {
        sum += Number(cpf[i]) * (11 - i);
    }

    let digit2 = (sum * 10) % 11;

    if (digit2 === 10) {
        digit2 = 0;
    }

    return digit2 === Number(cpf[10]);
}

function converterDataParaMysql(dataBr) {
    const partes = dataBr.split("/");

    if (partes.length !== 3) {
        return "";
    }

    return `${partes[2]}-${partes[1]}-${partes[0]}`;
}

function atualizarRegrasSenha(value) {
    const checks = {
        "rule-length": value.length >= 8 && value.length <= 25,
        "rule-number": /[0-9]/.test(value),
        "rule-upper": /[A-Z]/.test(value),
        "rule-lower": /[a-z]/.test(value)
    };

    Object.entries(checks).forEach(function ([id, valid]) {
        const item = document.getElementById(id);

        if (!item) return;

        const texto = item.textContent.replace(/^[✓○]\s/, "");

        item.classList.toggle("ok", valid);
        item.textContent = `${valid ? "✓" : "○"} ${texto}`;
    });
}