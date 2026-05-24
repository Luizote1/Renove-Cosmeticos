class GerenciadorCheckout {
    constructor() {
        this.carrinho = [];
        this.iniciar();
    }

    iniciar() {
        this.carregarCarrinho();
        this.configurarEventos();
        this.atualizarResumoPedido();
        this.configurarAlternanciaPagamento();
    }

    carregarCarrinho() {
        const carrinhoSalvo = localStorage.getItem("cart");
        this.carrinho = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
    }

    configurarEventos() {
        const formulario = document.getElementById("checkoutForm");

        if (formulario) {
            formulario.addEventListener("submit", (e) => {
                e.preventDefault();
                this.processarCheckout();
            });
        }

        this.configurarMascaras();

        const inputCep = document.getElementById("zipCode");

        if (inputCep) {
            inputCep.addEventListener("blur", (e) => {
                this.consultarCepAPI(e.target.value);
            });

            inputCep.addEventListener("input", (e) => {
                this.limparStatusVisual(e.target);
            });
        }
    }

    async consultarCepAPI(cep) {
        const cepLimpo = cep.replace(/\D/g, "");
        const campoCep = document.getElementById("zipCode");

        if (cepLimpo.length !== 8) return;

        this.alternarLoadingInput(campoCep, true);

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const dados = await resposta.json();

            this.alternarLoadingInput(campoCep, false);

            if (!dados.erro) {
                this.preencherCampoSeguro(["rua"], dados.logradouro);
                this.preencherCampoSeguro(["bairro"], dados.bairro);
                this.preencherCampoSeguro(["cidade"], dados.localidade);
                this.preencherCampoSeguro(["estado"], dados.uf);

                campoCep.classList.add("is-valid");
                campoCep.classList.remove("is-invalid");

                const campoNumero = document.getElementById("numero");

                if (campoNumero) {
                    campoNumero.focus();
                }

            } else {
                this.mostrarErroInput(campoCep, "CEP não encontrado.");
            }

        } catch (erro) {
            this.alternarLoadingInput(campoCep, false);
            console.error("Erro CEP:", erro);
            this.mostrarErroInput(campoCep, "Erro ao consultar CEP.");
        }
    }

    preencherCampoSeguro(listaIds, valor) {
        if (!valor) return;

        for (let id of listaIds) {
            let elemento = document.getElementById(id);

            if (elemento) {
                elemento.value = valor;
                elemento.readOnly = false;
                elemento.disabled = false;
                elemento.dispatchEvent(new Event("input"));
                return;
            }
        }
    }

    alternarLoadingInput(input, ativado) {
        if (!input || !input.parentNode) return;

        let loadingDiv = input.parentNode.querySelector(".input-loading-feedback");

        if (ativado) {
            if (!loadingDiv) {
                loadingDiv = document.createElement("div");
                loadingDiv.className = "input-loading-feedback text-primary small mt-1";
                loadingDiv.innerHTML =
                    '<span class="spinner-border spinner-border-sm me-1"></span>Buscando endereço...';

                input.parentNode.insertBefore(loadingDiv, input.nextSibling);
            }
        } else {
            if (loadingDiv) {
                loadingDiv.remove();
            }
        }
    }

    limparStatusVisual(input) {
        input.classList.remove("is-valid");
        input.classList.remove("is-invalid");
        this.alternarLoadingInput(input, false);
    }

    configurarMascaras() {
        const inputCep = document.getElementById("zipCode");

        if (inputCep) {
            inputCep.addEventListener("input", (e) => {
                let valor = e.target.value.replace(/\D/g, "");
                valor = valor.slice(0, 8);
                valor = valor.replace(/(\d{5})(\d{3})/, "$1-$2");
                e.target.value = valor;
            });
        }

        const inputCartao = document.getElementById("cardNumber");

        if (inputCartao) {
            inputCartao.addEventListener("input", (e) => {
                let valor = e.target.value.replace(/\D/g, "");
                valor = valor.slice(0, 16);

                valor = valor.replace(/(\d{4})(\d)/, "$1 $2");
                valor = valor.replace(/(\d{4})(\d)/, "$1 $2");
                valor = valor.replace(/(\d{4})(\d)/, "$1 $2");

                e.target.value = valor;
            });
        }

        const inputValidade = document.getElementById("expiryDate");

        if (inputValidade) {
            inputValidade.addEventListener("input", (e) => {
                let valor = e.target.value.replace(/\D/g, "");
                valor = valor.slice(0, 4);
                valor = valor.replace(/(\d{2})(\d{2})/, "$1/$2");
                e.target.value = valor;
            });
        }

        const inputCvv = document.getElementById("cvv");

        if (inputCvv) {
            inputCvv.addEventListener("input", (e) => {
                e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
            });
        }
    }

    configurarAlternanciaPagamento() {
        const metodosPagamento = document.querySelectorAll('input[name="paymentMethod"]');
        const camposCartao = document.getElementById("creditCardFields");

        if (metodosPagamento.length > 0 && camposCartao) {
            metodosPagamento.forEach(metodo => {
                metodo.addEventListener("change", (e) => {
                    camposCartao.style.display =
                        e.target.value === "credit" ? "block" : "none";
                });
            });
        }
    }

    atualizarResumoPedido() {
        const resumoPedido = document.getElementById("orderSummary");
        const elementoSubtotal = document.getElementById("subtotal");

        if (!resumoPedido || !elementoSubtotal) return;

        if (this.carrinho.length === 0) {
            resumoPedido.innerHTML = '<p class="text-muted">Carrinho vazio</p>';
            elementoSubtotal.textContent = "R$ 0,00";

            const elFrete = document.getElementById("shipping");
            const elTaxas = document.getElementById("taxes");
            const elTotal = document.getElementById("total");

            if (elFrete) elFrete.textContent = "R$ 0,00";
            if (elTaxas) elTaxas.textContent = "R$ 0,00";
            if (elTotal) elTotal.textContent = "R$ 0,00";

            return;
        }

        resumoPedido.innerHTML = this.carrinho.map(item => `
            <div class="d-flex align-items-center mb-3">
                <img src="${item.image}" 
                     alt="${item.name}" 
                     style="width: 50px; height: 50px; object-fit: contain;" 
                     class="me-3">

                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.name}</h6>
                    <p class="mb-1 text-muted">Qtd: ${item.quantity}</p>
                    <p class="mb-0 fw-bold">
                        R$ ${(Number(item.price) * Number(item.quantity)).toFixed(2).replace(".", ",")}
                    </p>
                </div>
            </div>
        `).join("");

        const subtotal = this.carrinho.reduce((soma, item) => {
            return soma + (Number(item.price) * Number(item.quantity));
        }, 0);

        const frete = subtotal > 100 ? 0 : 15.90;
        const taxas = subtotal * 0.05;
        const total = subtotal + frete + taxas;

        elementoSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;

        const elFrete = document.getElementById("shipping");
        const elTaxas = document.getElementById("taxes");
        const elTotal = document.getElementById("total");

        if (elFrete) {
            elFrete.textContent = frete === 0
                ? "Grátis"
                : `R$ ${frete.toFixed(2).replace(".", ",")}`;
        }

        if (elTaxas) {
            elTaxas.textContent = `R$ ${taxas.toFixed(2).replace(".", ",")}`;
        }

        if (elTotal) {
            elTotal.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
        }
    }

    validarFormulario() {
        this.limparTodasValidacoes();

        let valido = true;

        if (this.carrinho.length === 0) {
            alert("Seu carrinho está vazio.");
            return false;
        }

        for (let item of this.carrinho) {
            if (Number(item.quantity) > Number(item.stock)) {
                alert(`Quantidade acima do estoque para o produto: ${item.name}`);
                return false;
            }
        }

        const camposObrigatorios = [
            "zipCode",
            "rua",
            "bairro",
            "cidade",
            "estado",
            "numero"
        ];

        for (let id of camposObrigatorios) {
            const campo = document.getElementById(id);

            if (campo && !campo.value.trim()) {
                this.mostrarErroInput(campo, "Campo obrigatório.");
                valido = false;
            }
        }

        const metodoPagamento = document.querySelector('input[name="paymentMethod"]:checked');

        if (metodoPagamento && metodoPagamento.value === "credit") {
            const camposCartao = [
                "cardNumber",
                "expiryDate",
                "cvv",
                "cardName"
            ];

            camposCartao.forEach(id => {
                const campo = document.getElementById(id);

                if (campo && !campo.value.trim()) {
                    this.mostrarErroInput(campo, "Campo obrigatório.");
                    valido = false;
                }
            });
        }

        if (!valido) {
            const primeiroErro = document.querySelector(".is-invalid");

            if (primeiroErro) {
                primeiroErro.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        }

        return valido;
    }

    async processarCheckout() {
        if (!this.validarFormulario()) return;

        const botaoSubmit = document.querySelector('button[type="submit"]');

        let textoOriginal = "";

        if (botaoSubmit) {
            textoOriginal = botaoSubmit.innerHTML;
            botaoSubmit.disabled = true;
            botaoSubmit.innerHTML =
                '<span class="spinner-border spinner-border-sm me-2"></span>Processando...';
        }

        await this.finalizarCompra();

        if (botaoSubmit) {
            botaoSubmit.disabled = false;
            botaoSubmit.innerHTML = textoOriginal;
        }
    }

    async finalizarCompra() {
        const metodoPagamento = document.querySelector('input[name="paymentMethod"]:checked');

        const dadosPedido = {
            endereco: {
                cep: document.getElementById("zipCode").value,
                rua: document.getElementById("rua").value,
                numero: document.getElementById("numero").value,
                bairro: document.getElementById("bairro").value,
                cidade: document.getElementById("cidade").value,
                estado: document.getElementById("estado").value,
                complemento: document.getElementById("complemento")
                    ? document.getElementById("complemento").value
                    : ""
            },

            pagamento: metodoPagamento ? metodoPagamento.value : "Não informado",

            carrinho: this.carrinho
        };

        try {
            let resposta = await fetch("/checkout/finalizar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosPedido)
            });

            let retorno = await resposta.json();

            alert(retorno.msg);

            if (retorno.ok) {
                localStorage.removeItem("cart");

                this.mostrarAlertaSucesso("Compra realizada com sucesso!");

                setTimeout(() => {
                    window.location.href = "/pedido/meus-pedidos";
                }, 1000);
            }

        } catch (erro) {
            console.error("Erro ao finalizar compra:", erro);
            alert("Erro ao finalizar compra.");
        }
    }

    mostrarErroInput(input, mensagem) {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");

        let feedback = input.nextElementSibling;

        if (!feedback || !feedback.classList.contains("invalid-feedback")) {
            feedback = document.createElement("div");
            feedback.className = "invalid-feedback";
            input.parentNode.insertBefore(feedback, input.nextSibling);
        }

        feedback.textContent = mensagem;
    }

    limparErro(input) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
    }

    limparTodasValidacoes() {
        document.querySelectorAll(".form-control, .form-select").forEach(input => {
            input.classList.remove("is-invalid");
            input.classList.remove("is-valid");
        });
    }

    mostrarAlertaSucesso(mensagem) {
        const alerta = document.createElement("div");

        alerta.className =
            "alert alert-success fade show position-fixed top-0 start-50 translate-middle-x mt-3";

        alerta.style.zIndex = "9999";

        alerta.innerHTML =
            `${mensagem} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;

        document.body.appendChild(alerta);

        setTimeout(() => alerta.remove(), 5000);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new GerenciadorCheckout();
});