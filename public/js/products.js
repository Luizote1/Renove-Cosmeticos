class ProductManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.cart = [];
        this.init();
    }

    init() {
        this.loadProducts();
        this.loadCart();
        this.setupEventListeners();
        this.renderProducts();
        this.updateResultsCount();
    }

    loadProducts() {
        let produtosBackend = [];

        try {
            const jsonElement = document.getElementById("produtos-json");
            produtosBackend = jsonElement ? JSON.parse(jsonElement.textContent) : [];
        } catch (erro) {
            console.error("Erro ao ler produtos do backend:", erro);
        }

        this.products = produtosBackend.map(p => {
            const precoOriginal = Number(p.proPreco) || 0;
            const promoPrecoFinal = p.promoPrecoFinal != null ? Number(p.promoPrecoFinal) : null;
            const promoDesconto = p.promoDesconto != null ? Number(p.promoDesconto) : 0;

            const temPromocao =
                promoPrecoFinal != null &&
                promoPrecoFinal > 0 &&
                promoPrecoFinal < precoOriginal;

            return {
                id: p.proCodigo,
                name: p.proNome,
                category: p.catDescricao || "Sem categoria",
                price: temPromocao ? promoPrecoFinal : precoOriginal,
                originalPrice: precoOriginal,
                hasPromotion: temPromocao,
                discount: promoDesconto,
                stock: Number(p.proEstoque) || 0,
                rating: 5,
                image: p.proImagem || "/img/produtos/produto-sem-imagem.png",
                description: p.proDescricao || "Sem descrição",
                volume: (Number(p.proEstoque) || 0) + " em estoque",
                skinType: p.tipDescricao || "Não informado",
                labNome: p.labNome || "Não informado",
                validade: p.proDataValidade || null
            };
        });

        this.filteredProducts = [...this.products];
    }

    setupEventListeners() {
        const searchInput = document.getElementById("searchInput");
        const categoryFilter = document.getElementById("categoryFilter");
        const priceFilter = document.getElementById("priceFilter");
        const sortSelect = document.getElementById("sortSelect");
        const btnFiltrar = document.getElementById("btnFiltrar");

        if (searchInput) {
            searchInput.addEventListener("input", () => this.applyFilters());
        }

        if (categoryFilter) {
            categoryFilter.addEventListener("change", () => this.applyFilters());
        }

        if (priceFilter) {
            priceFilter.addEventListener("change", () => this.applyFilters());
        }

        if (sortSelect) {
            sortSelect.addEventListener("change", () => this.sortProducts());
        }

        if (btnFiltrar) {
            btnFiltrar.addEventListener("click", () => this.applyFilters());
        }
    }

    applyFilters() {
        const searchTerm = document.getElementById("searchInput")?.value.toLowerCase() || "";
        const category = document.getElementById("categoryFilter")?.value || "";
        const priceRange = document.getElementById("priceFilter")?.value || "";

        this.filteredProducts = this.products.filter(product => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm);

            const matchesCategory = !category || product.category === category;
            const matchesPrice = this.matchesPriceRange(product.price, priceRange);

            return matchesSearch && matchesCategory && matchesPrice;
        });

        this.sortProducts(false);
        this.renderProducts();
        this.updateResultsCount();
    }

    matchesPriceRange(price, range) {
        if (!range) return true;

        if (range === "0-50") return price <= 50;
        if (range === "50-100") return price > 50 && price <= 100;
        if (range === "100-200") return price > 100 && price <= 200;
        if (range === "200+") return price > 200;

        return true;
    }

    sortProducts(render = true) {
        const sortBy = document.getElementById("sortSelect")?.value || "";

        this.filteredProducts.sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "price-low") return a.price - b.price;
            if (sortBy === "price-high") return b.price - a.price;
            return 0;
        });

        if (render) {
            this.renderProducts();
        }
    }

    renderProducts() {
        const grid = document.getElementById("productsGrid");
        if (!grid) return;

        grid.innerHTML = "";

        if (this.filteredProducts.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-search display-1 text-muted"></i>
                    <h3 class="mt-3">Nenhum produto encontrado</h3>
                    <p class="text-muted">Tente ajustar os filtros de busca</p>
                </div>
            `;
            return;
        }

        this.filteredProducts.forEach(product => {
            grid.appendChild(this.createProductCard(product));
        });
    }

    montarPrecoHtml(product) {
        if (product.hasPromotion) {
            return `
                <div class="mb-2">
                    <div class="d-flex align-items-center gap-2 flex-wrap">
                        <span class="text-muted text-decoration-line-through">
                            R$ ${product.originalPrice.toFixed(2).replace(".", ",")}
                        </span>

                        <span class="badge bg-danger">
                            -${product.discount.toFixed(0)}%
                        </span>
                    </div>

                    <h4 class="text-danger fw-bold mt-1 mb-0">
                        R$ ${product.price.toFixed(2).replace(".", ",")}
                    </h4>
                </div>
            `;
        }

        return `
            <h4 class="text-primary">
                R$ ${product.price.toFixed(2).replace(".", ",")}
            </h4>
        `;
    }

    createProductCard(product) {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";

        col.innerHTML = `
            <div class="card product-card shadow-sm h-100">
                <div class="position-relative overflow-hidden">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 220px; object-fit: contain; padding: 1.5rem;">

                    <div class="position-absolute top-0 end-0 m-3">
                        <span class="badge bg-warning text-dark">
                            <i class="bi bi-star-fill"></i> ${product.rating}
                        </span>
                    </div>

                    <div class="position-absolute top-0 start-0 m-3">
                        <span class="badge bg-primary">${product.category}</span>
                    </div>

                    ${
                        product.hasPromotion
                            ? `
                                <div class="position-absolute bottom-0 start-0 m-3">
                                    <span class="badge bg-danger">
                                        PROMOÇÃO
                                    </span>
                                </div>
                            `
                            : ""
                    }
                </div>

                <div class="card-body d-flex flex-column">
                    <h5 class="fw-bold">${product.name}</h5>
                    <p class="text-muted">${this.limitText(product.description, 80)}</p>

                    <p class="${product.stock <= 0 ? "text-danger" : "text-success"} fw-bold">
                        ${product.stock <= 0 ? "Fora de estoque" : product.stock + " em estoque"}
                    </p>

                    <div class="mt-auto">
                        ${this.montarPrecoHtml(product)}

                        <button class="btn btn-outline-primary w-100 mb-2"
                            onclick="productManager.viewProduct('${product.id}')">
                            Ver Detalhes
                        </button>

                        ${
                            product.stock <= 0
                                ? `<button class="btn btn-secondary w-100" disabled>Indisponível</button>`
                                : `<button class="btn btn-primary w-100" onclick="productManager.addToCart('${product.id}')">Adicionar ao Carrinho</button>`
                        }
                    </div>
                </div>
            </div>
        `;

        return col;
    }

    limitText(text, limit) {
        if (!text) return "";
        return text.length > limit ? text.substring(0, limit) + "..." : text;
    }

    viewProduct(productId) {
        const product = this.products.find(p => p.id == productId);
        if (!product) return;

        const modalBody = document.getElementById("productModalBody");
        if (!modalBody) return;

        const precoModal = product.hasPromotion
            ? `
                <p class="text-muted text-decoration-line-through mb-1">
                    R$ ${product.originalPrice.toFixed(2).replace(".", ",")}
                </p>

                <span class="badge bg-danger mb-2">
                    ${product.discount.toFixed(0)}% OFF
                </span>

                <h2 class="text-danger mt-2">
                    R$ ${product.price.toFixed(2).replace(".", ",")}
                </h2>
            `
            : `
                <h2 class="text-primary mt-4">
                    R$ ${product.price.toFixed(2).replace(".", ",")}
                </h2>
            `;

        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-5 text-center">
                    <img src="${product.image}" class="img-fluid rounded" alt="${product.name}" style="max-height:300px; object-fit:contain;">
                </div>

                <div class="col-md-7">
                    <h3 class="fw-bold mb-3">${product.name}</h3>

                    <span class="badge bg-primary">${product.category}</span>

                    ${
                        product.hasPromotion
                            ? `<span class="badge bg-danger ms-2">PROMOÇÃO</span>`
                            : ""
                    }

                    <p class="text-muted mt-3">${product.description}</p>

                    <hr>

                    <p><strong>Tipo:</strong> ${product.skinType}</p>
                    <p><strong>Laboratório:</strong> ${product.labNome}</p>

                    <p class="${product.stock <= 0 ? "text-danger" : "text-success"} fw-bold">
                        <strong>Estoque:</strong> ${product.stock <= 0 ? "Fora de estoque" : product.stock + " em estoque"}
                    </p>

                    ${precoModal}

                    ${
                        product.stock <= 0
                            ? `<button class="btn btn-secondary w-100 mt-3" disabled>Indisponível</button>`
                            : `<button class="btn btn-primary w-100 mt-3" onclick="productManager.addToCart('${product.id}')">Adicionar ao Carrinho</button>`
                    }
                </div>
            </div>
        `;

        const modalEl = document.getElementById("productModal");

        if (modalEl) {
            new bootstrap.Modal(modalEl).show();
        }
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id == productId);
        if (!product) return;

        if (product.stock <= 0) {
            this.showNotification("Produto indisponível.");
            return;
        }

        const existingItem = this.cart.find(item => item.id == productId);

        if (existingItem) {
            if (existingItem.quantity >= product.stock) {
                this.showNotification(`Só existem ${product.stock} unidades em estoque.`);
                return;
            }

            existingItem.quantity++;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`${product.name} adicionado ao carrinho!`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id != productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id == productId);
        if (!item) return;

        if (change > 0 && item.quantity >= item.stock) {
            this.showNotification(`Só existem ${item.stock} unidades em estoque.`);
            return;
        }

        item.quantity += change;

        if (item.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    saveCart() {
        localStorage.setItem("cart", JSON.stringify(this.cart));
        this.updateCartCount();
    }

    loadCart() {
        const savedCart = localStorage.getItem("cart");
        this.cart = savedCart ? JSON.parse(savedCart) : [];
        this.updateCartDisplay();
    }

    updateCartCount() {
        const el = document.getElementById("cartCount");
        const elMobile = document.getElementById("cartCountMobile");

        const total = this.cart.reduce((total, item) => total + item.quantity, 0);

        if (el) {
            el.textContent = total;
        }

        if (elMobile) {
            elMobile.textContent = total;
        }
    }

    updateCartDisplay() {
        const cartItems = document.getElementById("cartItems");
        const cartTotal = document.getElementById("cartTotal");

        if (!cartItems || !cartTotal) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-cart3 display-4 text-muted"></i>
                    <p class="mt-2 text-muted">Seu carrinho está vazio</p>
                </div>
            `;

            cartTotal.textContent = "R$ 0,00";
            this.updateCartCount();
            return;
        }

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item mb-3">
                <div class="d-flex align-items-center">
                    <img src="${item.image}" style="width:50px;height:50px;object-fit:contain;" class="me-3">

                    <div class="flex-grow-1">
                        <h6>${item.name}</h6>

                        ${
                            item.hasPromotion
                                ? `
                                    <p class="mb-1">
                                        <span class="text-muted text-decoration-line-through">
                                            R$ ${Number(item.originalPrice).toFixed(2).replace(".", ",")}
                                        </span>
                                        <br>
                                        <strong class="text-danger">
                                            R$ ${Number(item.price).toFixed(2).replace(".", ",")}
                                        </strong>
                                    </p>
                                `
                                : `
                                    <p class="mb-1">
                                        R$ ${Number(item.price).toFixed(2).replace(".", ",")}
                                    </p>
                                `
                        }

                        <small class="text-muted">
                            Estoque: ${item.stock}
                        </small>

                        <div class="mt-2">
                            <button class="btn btn-sm btn-outline-secondary" onclick="productManager.updateQuantity('${item.id}', -1)">-</button>

                            <span class="mx-2">${item.quantity}</span>

                            <button 
                                class="btn btn-sm btn-outline-secondary"
                                onclick="productManager.updateQuantity('${item.id}', 1)"
                                ${item.quantity >= item.stock ? "disabled" : ""}
                            >
                                +
                            </button>

                            <button class="btn btn-sm btn-outline-danger ms-2" onclick="productManager.removeFromCart('${item.id}')">
                                Remover
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join("");

        const total = this.cart.reduce((soma, item) => {
            return soma + item.price * item.quantity;
        }, 0);

        cartTotal.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
        this.updateCartCount();
    }

    updateResultsCount() {
        const el = document.getElementById("resultsCount");
        if (!el) return;

        const count = this.filteredProducts.length;
        const total = this.products.length;

        el.textContent =
            count === total
                ? "Mostrando todos os produtos"
                : `Mostrando ${count} de ${total} produtos`;
    }

    showNotification(message) {
        const toast = document.createElement("div");
        toast.className = "position-fixed top-0 end-0 p-3";
        toast.style.zIndex = "9999";

        toast.innerHTML = `
            <div class="toast show">
                <div class="toast-header">
                    <strong class="me-auto">Renove</strong>
                    <button type="button" class="btn-close" onclick="this.closest('.position-fixed').remove()"></button>
                </div>
                <div class="toast-body">${message}</div>
            </div>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

function checkout() {
    if (!productManager || productManager.cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    window.location.href = "/checkout";
}

let productManager;

document.addEventListener("DOMContentLoaded", () => {
    productManager = new ProductManager();
});