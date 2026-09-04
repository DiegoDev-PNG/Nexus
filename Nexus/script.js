const products = [
    {
        id: 1,
        name: "Nexus Z Fold Ultra 5G",
        price: 8999.00,
        category: "mobile",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&auto=format&fit=crop",
        badge: "Lançamento",
        desc: "Inteligen̂cia Nexus AI com tela dobrável Dynamic AMOLED 2X.",
        ai: true,
        fiveG: true
    },
    {
        id: 2,
        name: "Nexus Watch Ultra Black",
        price: 2499.00,
        category: "wearable",
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=500&auto=format&fit=crop",
        badge: "Oferta",
        desc: "Caixa em titânio e bateria com duração de até 100 horas.",
        ai: true,
        fiveG: false
    },
    {
        id: 3,
        name: "Nexus Tab S9 Ultra",
        price: 5499.00,
        category: "tablets",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=500&auto=format&fit=crop",
        badge: "Top de Linha",
        desc: "Acompanha S-Pen de altíssima precisão e tela 14.6 polegadas.",
        ai: true,
        fiveG: true
    },
    {
        id: 4,
        name: "Nexus Buds Pro 3",
        price: 1199.00,
        category: "audio",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=500&auto=format&fit=crop",
        badge: "Áudio Hi-Fi",
        desc: "Cancelamento de ruído ativo ajustável em tempo real.",
        ai: false,
        fiveG: false
    },
    {
        id: 5,
        name: "Nexus Smart TV Neo QLED 65",
        price: 6899.00,
        category: "home",
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=500&auto=format&fit=crop",
        badge: "4K 144Hz",
        desc: "Processador de IA com contraste infinito e design Ultraslim.",
        ai: true,
        fiveG: false
    },
    {
        id: 6,
        name: "Nexus Book 4 Pro 360",
        price: 7299.00,
        category: "tablets",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=500&auto=format&fit=crop",
        badge: "Intel EVO",
        desc: "Notebook 2 em 1 leve e potente com tela touchscreen AMOLED.",
        ai: true,
        fiveG: false
    }
];

// ESTADOS DA APLICAÇÃO
let cart = [];
let favorites = [];
let currentCategory = 'all';
let currentUser = null;
let selectedPayMethod = 'pix';

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
});

// RENDERIZAR PRODUTOS
function renderProducts(items) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">Nenhum produto encontrado com os filtros selecionados.</p>';
        return;
    }

    items.forEach(prod => {
        const isFav = favorites.includes(prod.id);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            ${prod.badge ? `<span class="card-badge">${prod.badge}</span>` : ''}
            <button class="fav-toggle ${isFav ? 'active' : ''}" onclick="toggleFav(${prod.id})" title="Favoritar">
                <i class="fa-solid fa-heart"></i>
            </button>
            <img src="${prod.image}" alt="${prod.name}" class="card-img">
            <div>
                <h3 class="card-title">${prod.name}</h3>
                <p class="card-desc">${prod.desc}</p>
            </div>
            <div class="card-price-box">
                <div class="card-price">R$ ${prod.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                <div class="card-installments">12x de R$ ${(prod.price / 12).toLocaleString('pt-BR', {minimumFractionDigits: 2})} sem juros</div>
                <button class="btn btn-primary btn-block" onclick="addToCart(${prod.id})">Adicionar ao Carrinho</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// FILTRAGEM
function filterCategory(cat, btnElement) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    applyFilters();
}

function updatePriceLabel(val) {
    document.getElementById('price-val').innerText = `R$ ${parseInt(val).toLocaleString('pt-BR')}`;
}

function applyFilters() {
    const searchVal = document.getElementById('search-input').value.toLowerCase();
    const maxPrice = parseFloat(document.getElementById('price-filter').value);
    const checkAI = document.getElementById('check-ai').checked;
    const check5G = document.getElementById('check-5g').checked;

    const filtered = products.filter(p => {
        const matchesCategory = currentCategory === 'all' || p.category === currentCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchVal) || p.desc.toLowerCase().includes(searchVal);
        const matchesPrice = p.price <= maxPrice;
        const matchesAI = !checkAI || p.ai;
        const matches5G = !check5G || p.fiveG;

        return matchesCategory && matchesSearch && matchesPrice && matchesAI && matches5G;
    });

    renderProducts(filtered);
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('price-filter').value = 10000;
    document.getElementById('check-ai').checked = false;
    document.getElementById('check-5g').checked = false;
    updatePriceLabel(10000);
    filterCategory('all', document.querySelector('.cat-btn[data-cat="all"]'));
}

// FAVORITOS
function toggleFav(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    updateFavUI();
    applyFilters();
}

function updateFavUI() {
    document.getElementById('fav-count').innerText = favorites.length;
    const container = document.getElementById('fav-items');
    container.innerHTML = '';

    if (favorites.length === 0) {
        container.innerHTML = '<p class="text-center" style="color: #777;">Sua lista de desejos está vazia.</p>';
        return;
    }

    favorites.forEach(id => {
        const prod = products.find(p => p.id === id);
        container.innerHTML += `
            <div class="fav-item">
                <img src="${prod.image}" alt="${prod.name}">
                <div class="item-info">
                    <h4>${prod.name}</h4>
                    <p>R$ ${prod.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                </div>
                <button class="close-btn" onclick="toggleFav(${prod.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    });
}

// CARRINHO
function addToCart(id) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id, qty: 1 });
    }
    updateCartUI();
    toggleCart(true);
}

function quickAddToCart(id) {
    addToCart(id);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    document.getElementById('cart-count').innerText = totalItems;

    const container = document.getElementById('cart-items');
    container.innerHTML = '';

    let totalPrice = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p class="text-center" style="color: #777; margin-top: 30px;">Seu carrinho está vazio.</p>';
    } else {
        cart.forEach(item => {
            const prod = products.find(p => p.id === item.id);
            const subtotal = prod.price * item.qty;
            totalPrice += subtotal;

            container.innerHTML += `
                <div class="cart-item">
                    <img src="${prod.image}" alt="${prod.name}">
                    <div class="item-info">
                        <h4>${prod.name}</h4>
                        <p>${item.qty}x R$ ${prod.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                    </div>
                    <button class="close-btn" onclick="removeFromCart(${prod.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
        });
    }

    document.getElementById('cart-total').innerText = `R$ ${totalPrice.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
}

function toggleCart(forceOpen = false) {
    const drawer = document.getElementById('cart-drawer');
    if (forceOpen) {
        drawer.classList.add('active');
    } else {
        drawer.classList.toggle('active');
    }
}

// MODAIS
function toggleModal(id) {
    const modal = document.getElementById(id);
    modal.classList.toggle('active');
}

// LOGIN
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    currentUser = email.split('@')[0];
    document.getElementById('user-display').innerText = currentUser;
    toggleModal('user-modal');
}

// CHECKOUT & PAGAMENTO
function openCheckout() {
    if (cart.length === 0) {
        alert("Adicione produtos ao carrinho antes de finalizar a compra.");
        return;
    }
    toggleCart();
    selectPayMethod('pix');
    toggleModal('checkout-modal');
}

function selectPayMethod(method) {
    selectedPayMethod = method;
    document.getElementById('btn-pix').classList.toggle('active', method === 'pix');
    document.getElementById('btn-card').classList.toggle('active', method === 'card');

    const total = cart.reduce((acc, item) => {
        const prod = products.find(p => p.id === item.id);
        return acc + (prod.price * item.qty);
    }, 0);

    const payDetails = document.getElementById('pay-details');
    const finalPriceElem = document.getElementById('checkout-final-price');

    if (method === 'pix') {
        const pixDiscount = total * 0.95; // 5% de desconto
        finalPriceElem.innerText = `R$ ${pixDiscount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        payDetails.innerHTML = `
            <i class="fa-solid fa-qrcode" style="font-size: 3rem; margin-bottom: 12px; color: var(--brand-black);"></i>
            <p style="font-size: 0.85rem; color: #555;">Chave QR Code Pix gerada com 5% de desconto exclusivo.</p>
        `;
    } else {
        finalPriceElem.innerText = `R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        payDetails.innerHTML = `
            <i class="fa-regular fa-credit-card" style="font-size: 3rem; margin-bottom: 12px; color: var(--brand-black);"></i>
            <p style="font-size: 0.85rem; color: #555;">Pagamento em até 12x sem juros no cartão de crédito.</p>
        `;
    }
}

function processPayment() {
    alert("Pagamento simulado com sucesso! A Nexus agradece a sua preferência.");
    cart = [];
    updateCartUI();
    toggleModal('checkout-modal');
}
