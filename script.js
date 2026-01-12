/* ==========================================
   D'CASA - JavaScript
   Menu, Carrinho e Pedidos
   ========================================== */

document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initMenu();
    initCart();
    initFAQ();
    initCarousel();
    initScrollAnimations();
    initHeaderScroll();
    initSmoothScroll();
});

/* ==========================================
   Smooth Scroll Global
   ========================================== */
function initSmoothScroll() {
    // Aplicar smooth scroll a TODOS os links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Ignorar links vazios ou apenas "#"
            if (targetId === '#' || targetId === '') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ==========================================
   Header Scroll Effect
   ========================================== */
function initHeaderScroll() {
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================
   Mobile Menu
   ========================================== */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Smooth scroll programático
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }

                // Fechar menu mobile
                nav.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });
    }
}

/* ==========================================
   FAQ Accordion
   ========================================== */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });
}

/* ==========================================
   Menu Data & Rendering
   ========================================== */
const menuData = {
    tradicional: {
        title: "Cookies Clássicos",
        items: [
            { name: "Tradicional", price: 9.00, desc: "Massa amanteigada com gotas de chocolate meio amargo." },
            { name: "Gotas de Chocolate", price: 9.00, desc: "O clássico americano de chocolate branco e preto." },
            { name: "Açúcar e Canela", price: 8.00, desc: "Simples e aconchegante, o sabor da infância." }
        ]
    },
    especial: {
        title: "Cookies Especiais",
        items: [
            { name: "Nutella", price: 12.00, desc: "Recheado com a verdadeira Nutella cremosa." },
            { name: "Doce de Leite", price: 11.00, desc: "Recheio generoso de doce de leite artesanal." },
            { name: "Red Velvet", price: 13.00, desc: "Massa aveludada com recheio de cream cheese." },
            { name: "Pistache", price: 15.00, desc: "Incomparável sabor de pistache com chocolate branco." }
        ]
    },
    combo: {
        title: "Combos D'Casa",
        items: [
            { name: "Combo Dupla", price: 21.00, desc: "2 Cookies Clássicos à sua escolha." },
            { name: "Combo Família", price: 55.00, desc: "6 Cookies (3 Clássicos + 3 Recheados)." },
            { name: "Fornada de Sábado", price: 48.00, desc: "Combo especial do dia (5 cookies)." }
        ]
    }
};

let cart = {};
let currentType = 'tradicional';

function initMenu() {
    const container = document.getElementById('menu-container');
    const typeBtns = document.querySelectorAll('.type-btn');

    renderMenu(currentType);

    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentType = btn.dataset.type;
            renderMenu(currentType);
        });
    });
}

function renderMenu(type) {
    const container = document.getElementById('menu-container');
    const data = menuData[type];

    container.innerHTML = data.items.map(item => `
        <div class="menu-item-card">
            <div class="menu-item-header">
                <span class="menu-item-name">${item.name}</span>
                <span class="menu-item-price">R$ ${item.price.toFixed(2)}</span>
            </div>
            <p class="menu-item-description">${item.desc}</p>
            <div class="menu-item-actions">
                <div class="quantity-control">
                    <button class="qty-btn" onclick="updateItem('${item.name}', ${item.price}, -1)">-</button>
                    <span class="qty-value" id="qty-${item.name.replace(/\s+/g, '')}">${cart[item.name]?.qty || 0}</span>
                    <button class="qty-btn" onclick="updateItem('${item.name}', ${item.price}, 1)">+</button>
                </div>
            </div>
        </div>
    `).join('');
}

/* ==========================================
   Cart Logic
   ========================================== */
window.updateItem = function (name, price, change) {
    if (!cart[name]) cart[name] = { name, price, qty: 0 };
    cart[name].qty += change;

    if (cart[name].qty <= 0) delete cart[name];

    updateUI();
};

function updateUI() {
    const floatCart = document.getElementById('floating-cart');
    const countSpan = floatCart.querySelector('.cart-count');
    const totalSpan = floatCart.querySelector('.cart-total');

    let totalQty = 0;
    let totalPrice = 0;

    Object.values(cart).forEach(item => {
        totalQty += item.qty;
        totalPrice += item.qty * item.price;

        const qtyEl = document.getElementById(`qty-${item.name.replace(/\s+/g, '')}`);
        if (qtyEl) qtyEl.textContent = item.qty;
    });

    // Reset others if rendered
    document.querySelectorAll('.qty-value').forEach(el => {
        const name = el.id.replace('qty-', '');
        const found = Object.keys(cart).find(k => k.replace(/\s+/g, '') === name);
        if (!found) el.textContent = '0';
    });

    countSpan.textContent = `${totalQty} ${totalQty === 1 ? 'item' : 'itens'}`;
    totalSpan.textContent = `R$ ${totalPrice.toFixed(2)}`;

    if (totalQty > 0) floatCart.classList.remove('hidden');
    else floatCart.classList.add('hidden');
}

/* ==========================================
   Checkout & WhatsApp
   ========================================== */
function initCart() {
    const openBtn = document.getElementById('open-cart-btn');
    const modal = document.getElementById('checkout-modal');
    const sendBtn = document.getElementById('send-order-btn');
    const closeBtn = document.getElementById('close-modal-btn');
    const clearBtn = document.getElementById('clear-cart-btn');
    const deliveryRadios = document.getElementsByName('delivery-type');
    const paymentSelect = document.getElementById('payment-method');
    const needChangeCheckbox = document.getElementById('need-change');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
            renderPreview();
            updateModalTotal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', clearCart);
    }

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });

    // Delivery toggle
    deliveryRadios.forEach(radio => {
        radio.addEventListener('change', updateModalTotal);
    });

    // Payment method toggle
    if (paymentSelect) {
        paymentSelect.addEventListener('change', toggleCashChange);
    }

    // Toggle change input visibility
    if (needChangeCheckbox) {
        needChangeCheckbox.addEventListener('change', function () {
            const wrapper = document.getElementById('change-value-wrapper');
            if (this.checked) {
                wrapper.classList.remove('hidden');
            } else {
                wrapper.classList.add('hidden');
            }
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', generateWhatsAppMessage);
    }

    // Ensure initial state is synced
    toggleCashChange();
}

function toggleCashChange() {
    const payment = document.getElementById('payment-method').value;
    const cashGroup = document.getElementById('cash-change-group');

    if (payment === 'Dinheiro') {
        cashGroup.classList.remove('hidden');
    } else {
        cashGroup.classList.add('hidden');
        // Reset fields
        document.getElementById('need-change').checked = false;
        document.getElementById('change-value-wrapper').classList.add('hidden');
        document.getElementById('change-value').value = '';
    }
}

function updateModalTotal() {
    const deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;
    const addressGroup = document.getElementById('address-group');
    const deliveryNote = document.getElementById('delivery-note');

    let subtotal = 0;
    Object.values(cart).forEach(item => subtotal += (item.qty * item.price));

    let deliveryFee = 0;
    if (deliveryType === 'delivery') {
        deliveryFee = 8.00;
        addressGroup.classList.remove('hidden');
        deliveryNote.classList.remove('hidden');
    } else {
        addressGroup.classList.add('hidden');
        deliveryNote.classList.add('hidden');
    }

    const finalTotal = subtotal + deliveryFee;
    document.getElementById('modal-subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById('modal-total-final').textContent = `R$ ${finalTotal.toFixed(2)}`;
}

function renderPreview() {
    const preview = document.getElementById('cart-items-preview');
    let html = '';

    Object.values(cart).forEach(item => {
        const itemTotal = item.qty * item.price;
        html += `
            <div class="cart-item-row">
                <span>${item.qty}x ${item.name}</span>
                <span>R$ ${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });

    preview.innerHTML = html;
}

function clearCart() {
    cart = {};
    updateUI();
    document.getElementById('checkout-modal').classList.add('hidden');
    showToast('Sacola esvaziada! 🍪');
}

function generateWhatsAppMessage() {
    const name = document.getElementById('customer-name').value;
    const payment = document.getElementById('payment-method').value;
    const deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;
    const address = document.getElementById('delivery-address').value;

    // Calculate totals first for validation
    let subtotal = 0;
    Object.values(cart).forEach(item => {
        subtotal += item.qty * item.price;
    });
    let deliveryFee = deliveryType === 'delivery' ? 8.00 : 0;
    const finalTotal = subtotal + deliveryFee;

    // Change logic
    const needChange = document.getElementById('need-change').checked;
    const changeValueRaw = document.getElementById('change-value').value;

    if (!name) {
        showToast('Por favor, digite seu nome.');
        return;
    }

    if (deliveryType === 'delivery' && !address) {
        showToast('Por favor, informe o endereço de entrega.');
        return;
    }

    if (payment === 'Dinheiro' && needChange) {
        if (!changeValueRaw) {
            showToast('Por favor, informe para quanto você precisa de troco.');
            return;
        }

        // Simple currency parsing with global regex for separators
        const changeAmount = parseFloat(changeValueRaw.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());

        if (isNaN(changeAmount) || changeAmount <= finalTotal) {
            showToast('O valor para troco deve ser maior que o total do pedido.');
            return;
        }
    }

    let message = `*Novo Pedido - D'Casa Cookies*\n\n`;
    message += `*Cliente:* ${name}\n`;
    message += `*Pedido:*\n`;

    Object.values(cart).forEach(item => {
        const itemTotal = item.qty * item.price;
        message += `${item.qty}x ${item.name} - R$ ${itemTotal.toFixed(2)}\n`;
    });

    if (deliveryType === 'delivery') {
        message += `\n*Entrega:* Delivery (Promissão) - R$ 8,00\n`;
        message += `*Endereço:* ${address}\n`;
    } else {
        message += `\n*Entrega:* Retirada no Local\n`;
    }

    message += `\n*Total Final: R$ ${finalTotal.toFixed(2)}*\n`;
    message += `*Pagamento:* ${payment}\n`;

    if (payment === 'Dinheiro' && needChange) {
        message += `*Troco para:* ${changeValueRaw}\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    const phone = '5514981392626';

    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>🍪</span> <span>${message}</span>`;

    container.appendChild(toast);

    // Remove toast after animation (3s total)
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/* ==========================================
   Carousel/Gallery
   ========================================== */
function initCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');

    if (!track) return;

    const slides = track.querySelectorAll('.carousel-slide');
    let currentIndex = 0;
    let autoPlayInterval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
        resetAutoPlay();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 4000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide();
            resetAutoPlay();
        }
        if (touchEndX > touchStartX + 50) {
            prevSlide();
            resetAutoPlay();
        }
    }

    // Start auto-play
    startAutoPlay();

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    track.addEventListener('mouseleave', startAutoPlay);
}

/* ==========================================
   Scroll Animations
   ========================================== */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements
    document.querySelectorAll('.menu-item-card, .faq-item, .about-content, .section-gallery').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.querySelector('#sobre').scrollIntoView({ behavior: 'smooth' });
        });
    }
}
