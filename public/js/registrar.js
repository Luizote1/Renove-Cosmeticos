let currentStep = 1;

const steps = document.querySelectorAll('.step');
const progress = document.querySelectorAll('.progress span');
const stepLabel = document.getElementById('stepLabel');

function updateProgress(step) {

    stepLabel.textContent = `Passo ${step} de 2`;

    progress.forEach((bar, index) => {
        bar.classList.toggle('active', index < step);
    });
}

function goToStep(step) {

    currentStep = step;

    steps.forEach(s => s.classList.remove('active'));

    document
        .querySelector(`.step[data-step="${step}"]`)
        .classList.add('active');

    updateProgress(step);
}

async function nextStep(step) {

    if (step === 1 && !validateStep1()) {
        return;
    }

    if (step === 1) {
        goToStep(2);
        return;
    }

    if (step === 2 && !validateStep2()) {
        return;
    }

    try {

        const cpf = document.getElementById('cpf').value.trim();
        const nome = document.getElementById('nome').value.trim();
        const nascimento = document.getElementById('nascimento').value;
        const genero = document.getElementById('genero').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;

        const response = await fetch("/cadastro/gravar", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                cpf,
                nome,
                nascimento,
                genero,
                telefone,
                email,
                senha
            })
        });

        const json = await response.json();

        if (!json.ok) {

            alert(json.msg);
            return;
        }

        alert(json.msg);

        // AGORA ENTRA DIRETO LOGADO
        window.location.href = "/";

    } catch (erro) {

        console.log(erro);

        alert("Erro ao realizar cadastro.");
    }
}

function prevStep(step) {

    if (step > 1) {
        goToStep(step - 1);
    }
}

function showError(inputId, errorId, show = true) {

    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    if (input) {
        input.classList.toggle('invalid', show);
    }

    if (error) {
        error.classList.toggle('show', show);
    }
}

function clearError(inputId, errorId) {
    showError(inputId, errorId, false);
}

function onlyDigits(value) {
    return value.replace(/\D/g, '');
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

function isValidBirthDate(dateValue) {

    if (!dateValue) {
        return false;
    }

    const birth = new Date(dateValue + 'T00:00:00');

    const today = new Date();

    if (birth > today) {
        return false;
    }

    let age = today.getFullYear() - birth.getFullYear();

    const monthDiff = today.getMonth() - birth.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
        age--;
    }

    return age >= 13;
}

function validateStep1() {

    const cpf = document.getElementById('cpf').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const nascimento = document.getElementById('nascimento').value;
    const genero = document.getElementById('genero').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();
    const termos = document.getElementById('termos').checked;

    let ok = true;

    clearError('cpf', 'cpfError');
    clearError('nome', 'nomeError');
    clearError('nascimento', 'nascimentoError');
    clearError('genero', 'generoError');
    clearError('telefone', 'telefoneError');
    clearError('email', 'emailError');

    document
        .getElementById('termosError')
        .classList.remove('show');

    if (!isValidCPF(cpf)) {
        showError('cpf', 'cpfError');
        ok = false;
    }

    const nomePartes = nome.split(/\s+/).filter(Boolean);

    if (nomePartes.length < 2 || nome.length < 6) {
        showError('nome', 'nomeError');
        ok = false;
    }

    if (!isValidBirthDate(nascimento)) {
        showError('nascimento', 'nascimentoError');
        ok = false;
    }

    if (!genero) {
        showError('genero', 'generoError');
        ok = false;
    }

    if (onlyDigits(telefone).length !== 11) {
        showError('telefone', 'telefoneError');
        ok = false;
    }

    if (!isValidEmail(email)) {
        showError('email', 'emailError');
        ok = false;
    }

    if (!termos) {

        document
            .getElementById('termosError')
            .classList.add('show');

        ok = false;
    }

    return ok;
}

function validateStep2() {

    const senha = document.getElementById('senha').value;

    const confirmar = document.getElementById('confirmarSenha').value;

    const strong =
        senha.length >= 8 &&
        senha.length <= 25 &&
        /[0-9]/.test(senha) &&
        /[A-Z]/.test(senha) &&
        /[a-z]/.test(senha);

    clearError('senha', 'senhaError');
    clearError('confirmarSenha', 'confirmarSenhaError');

    let ok = true;

    if (!strong) {
        showError('senha', 'senhaError');
        ok = false;
    }

    if (!confirmar || senha !== confirmar) {
        showError('confirmarSenha', 'confirmarSenhaError');
        ok = false;
    }

    return ok;
}

// CPF
document.getElementById('cpf').addEventListener('input', async e => {

    let v = e.target.value.replace(/\D/g, '').slice(0, 11);

    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    e.target.value = v;

    clearError('cpf', 'cpfError');

    if (v.length === 14) {

        const response = await fetch('/cadastro/verificar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cpf: v.replace(/\D/g, '')
            })
        });

        const json = await response.json();

        if (json.existe) {

            document.getElementById('cpfError').textContent =
                'Este CPF já está cadastrado.';

            showError('cpf', 'cpfError');

        } else {

            document.getElementById('cpfError').textContent =
                'Digite um CPF válido.';
        }
    }
});

// EMAIL
document.getElementById('email').addEventListener('blur', async () => {

    const email = document.getElementById('email').value.trim();

    clearError('email', 'emailError');

    if (!isValidEmail(email)) {
        return;
    }

    const response = await fetch('/cadastro/verificar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email
        })
    });

    const json = await response.json();

    if (json.existe) {

        document.getElementById('emailError').textContent =
            'Este e-mail já está cadastrado.';

        showError('email', 'emailError');

    } else {

        document.getElementById('emailError').textContent =
            'Digite um e-mail válido.';
    }
});

document.getElementById('nome').addEventListener('input', () => {
    clearError('nome', 'nomeError');
});

document.getElementById('nascimento').addEventListener('input', () => {
    clearError('nascimento', 'nascimentoError');
});

document.getElementById('genero').addEventListener('change', () => {
    clearError('genero', 'generoError');
});

document.getElementById('telefone').addEventListener('input', e => {

    let v = e.target.value.replace(/\D/g, '').slice(0, 11);

    v = v.replace(/(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d{5})(\d{1,4})$/, '$1-$2');

    e.target.value = v;

    clearError('telefone', 'telefoneError');
});

document.getElementById('termos').addEventListener('change', () => {

    document
        .getElementById('termosError')
        .classList.remove('show');
});

document.getElementById('senha').addEventListener('input', e => {

    const value = e.target.value;

    const checks = {
        'rule-length': value.length >= 8 && value.length <= 25,
        'rule-number': /[0-9]/.test(value),
        'rule-upper': /[A-Z]/.test(value),
        'rule-lower': /[a-z]/.test(value)
    };

    Object.entries(checks).forEach(([id, valid]) => {

        const item = document.getElementById(id);

        const texto = item.textContent.replace(/^[✓○]\s/, '');

        item.classList.toggle('ok', valid);

        item.textContent = `${valid ? '✓' : '○'} ${texto}`;
    });

    clearError('senha', 'senhaError');
});

document.getElementById('confirmarSenha').addEventListener('input', () => {
    clearError('confirmarSenha', 'confirmarSenhaError');
});

document.querySelectorAll('.toggle-pass').forEach(btn => {

    btn.addEventListener('click', () => {

        const target = document.getElementById(btn.dataset.target);

        target.type =
            target.type === 'password'
                ? 'text'
                : 'password';
    });
});