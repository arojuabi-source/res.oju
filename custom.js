// to get current year
function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    document.querySelectorAll("#displayYear").forEach(function(el) {
        el.innerHTML = currentYear;
    });
}

getYear();

// isotope js (menu.html)
$(window).on('load', function () {
    $('.filters_menu li').click(function () {
        $('.filters_menu li').removeClass('active');
        $(this).addClass('active');
        var data = $(this).attr('data-filter');
        $grid.isotope({
            filter: data
        });
    });

    var $grid = $(".grid").isotope({
        itemSelector: ".all",
        percentPosition: false,
        masonry: {
            columnWidth: ".all"
        }
    });
});

// nice select
$(document).ready(function() {
    $('select').niceSelect();
});

// Fixed Google Map - use iframe instead of broken API
function initMap() {
    // Static iframe for Karangklesem area (Indonesia)
    const mapContainer = document.getElementById("googleMap");
    if (mapContainer) {
        mapContainer.innerHTML = `
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.422776920784!2d110.777!3d-7.567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMzQnMDIuNSJTIDEoMcKwNDYnMzQuMiJF!5e0!3m2!1sen!2sus!4v1720000000000!5m2!1sen!2sus" 
                width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy">
            </iframe>
        `;
    }
}

// client section owl carousel
if ($(".client_owl-carousel").length) {
    $(".client_owl-carousel").owlCarousel({
        loop: true,
        margin: 0,
        dots: false,
        nav: true,
        autoplay: true,
        autoplayHoverPause: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            0: { items: 1 },
            768: { items: 2 },
            1000: { items: 2 }
        }
    });
}

// === CART SYSTEM ===
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const menuItems = [
    { id: 1, name: 'Delicious Pizza 1', price: 20000, class: 'pizza' },
    { id: 2, name: 'Delicious Burger 1', price: 15000, class: 'burger' },
    { id: 3, name: 'Delicious Pizza 2', price: 17000, class: 'pizza' },
    { id: 4, name: 'Delicious Pizza 3', price: 15000, class: 'pizza' },
    { id: 5, name: 'Tasty Burger 1', price: 12000, class: 'burger' },
    { id: 6, name: 'Tasty Burger 2', price: 14000, class: 'burger' }
];

function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartBadge();
}

function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badges.forEach(badge => {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'inline' : 'none';
    });
}

function addToCart(menuId) {
    const item = menuItems.find(m => m.id === menuId);
    if (!item) return;
    const existing = cart.find(c => c.id === menuId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    showToast('Ditambahkan ke keranjang!', 'success');
}

function removeFromCart(menuId) {
    cart = cart.filter(c => c.id !== menuId);
    localStorage.setItem('cart', JSON.stringify(cart));
    populateCartModal();
    updateCartBadge();
}

function updateQuantity(menuId, delta) {
    const item = cart.find(c => c.id === menuId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(menuId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            populateCartModal();
            updateCartBadge();
        }
    }
}

function populateCartModal() {
    const tbody = document.querySelector('#cartTbody');
    let html = '';
    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        html += `
            <tr>
                <td>${item.name}</td>
                <td>Rp ${item.price.toLocaleString()}</td>
                <td>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    ${item.quantity}
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </td>
                <td>Rp ${subtotal.toLocaleString()}</td>
                <td><button class="btn-danger btn-sm" onclick="removeFromCart(${item.id})">Hapus</button></td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
    document.querySelector('#cartTotal').textContent = `Rp ${total.toLocaleString()}`;
}

function checkout() {
    if (cart.length === 0) {
        alert('Keranjang kosong!');
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Checkout berhasil!\nTotal: Rp ${total.toLocaleString()}\nTerima kasih!`);
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    populateCartModal();
    updateCartBadge();
    $('#cartModal').modal('hide');
}

// === ENHANCED SEARCH WITH HIGHLIGHT & SCROLL ===
function searchFilter(query) {
    const boxes = document.querySelectorAll('.grid .box, .food_section .box, .offer_section .box');
    let firstMatch = null;
    let matchCount = 0;
    
    // Reset all
    boxes.forEach(box => {
        box.classList.remove('scroll-to-highlight', 'search-highlight');
        box.style.display = '';
        box.innerHTML = box.innerHTML.replace(/<mark class="search-highlight">|<\/mark>/g, '');
    });
    
    boxes.forEach(box => {
        const text = box.textContent.toLowerCase();
        if (text.includes(query.toLowerCase())) {
            matchCount++;
            firstMatch = firstMatch || box;
            box.classList.add('scroll-to-highlight', 'search-highlight');
            box.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            box.style.display = 'none';
        }
    });
    
    if (matchCount === 0) {
        showToast('❌ Menu "' + query + '" tidak ditemukan. Coba "pizza", "burger", atau "tasty".', 'error');
    } else {
        showToast('✅ Ditemukan ' + matchCount + ' hasil untuk "' + query + '"', 'success');
        if (firstMatch) firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}


// === CHAT ===
let chatMessages = [];
function sendChatMessage() {
    const input = document.querySelector('#chatInput');
    const msg = input.value.trim();
    if (!msg) return;
    chatMessages.push({ user: 'You', text: msg });
    input.value = '';
    appendChatMessage('You', msg);
    // Bot response
    setTimeout(() => {
        const responses = [
            'Terima kasih! Pesanan akan diproses.',
            'Baik, kami akan hubungi Anda.',
            'Menu favorit apa hari ini?',
            'Pesan meja atau delivery?',
            '😊 Terima kasih sudah chat!'
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        appendChatMessage('Bot', response);
    }, 800);
}

function appendChatMessage(sender, text) {
    const chatBox = document.querySelector('#chatMessages');
    chatBox.innerHTML += `<div class="mb-2"><strong>${sender}:</strong> ${text}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Toast notification
function showToast(message, type = 'info') {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#007bff'
    };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = message;
    toast.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: ${colors[type] || colors.info};
        color: white; padding: 15px 20px; border-radius: 8px; z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15); transform: translateX(400px);
        transition: transform 0.4s ease, opacity 0.4s ease; opacity: 0; font-size: 14px; max-width: 350px;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// === BOOKING FORM ===
function handleBookingForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('bookingName') || 'N/A';
    const phone = formData.get('bookingPhone') || 'N/A';
    const email = formData.get('bookingEmail') || 'N/A';
    const persons = formData.get('persons') || 'N/A';
    const date = formData.get('bookingDate') || 'N/A';
    
    showToast(`Pesanan meja berhasil!\nNama: ${name}\nTel: ${phone}\nEmail: ${email}\nOrang: ${persons}\nTanggal: ${date}`, 'success');
    event.target.reset();
}

// === INIT ===
$(document).ready(function() {
    loadCart();
    initMap();

    // Modals & toggles (global)
    $(document).on('click', '#cartToggle', function(e) {
        e.preventDefault();
        populateCartModal();
        $('#cartModal').modal('show');
    });

    $(document).on('click', '#searchToggle', function(e) {
        e.preventDefault();
        $('#searchModal').modal('show');
    });

    $(document).on('click', '#chatToggle, .order_online, .btn1', function(e) {
        e.preventDefault();
        $('#chatModal').modal('show');
    });

    // Enhanced real-time search
    $(document).on('input', '#searchInput', function() {
        const query = $(this).val().trim();
        if (query.length >= 2) {
            searchFilter(query);
            showToast(`${query} - Menyorot hasil pencarian...`, 'info');
        } else {
            // Show all when query short
            document.querySelectorAll('.grid .box, .food_section .box, .offer_section .box').forEach(box => {
                box.style.display = '';
                box.classList.remove('scroll-to-highlight', 'search-highlight');
            });
        }
    });

    $(document).on('submit', '#searchForm', function(e) {
        e.preventDefault();
        $('#searchModal').modal('hide');
    });


    // Booking forms
    $(document).on('submit', 'form[action=""]', function(e) {
        handleBookingForm(e);
    });

    // Menu add to cart
    $(document).on('click', '.food_section .options a', function(e) {
        e.preventDefault();
        const menuBox = $(this).closest('.box');
        const menuId = parseInt(menuBox.data('menu-id'));
        if (menuId) addToCart(menuId);
    });

    // Contact/social links (prevent broken navigation)
    $(document).on('click', '.contact_link_box a, .footer_social a', function(e) {
        e.preventDefault();
        const icon = this.querySelector('i').className;
        let url = '#';
        if (icon.includes('fa-phone')) url = 'tel:+6281236096126';
        else if (icon.includes('fa-envelope')) url = 'mailto:timor@gmail.com';
        else if (icon.includes('fa-map-marker')) url = 'https://maps.app.goo.gl/1EzddQtoQyBWg8pm7';
        window.open(url, '_blank');
    });

    // Update cart on modal show
    $('#cartModal').on('shown.bs.modal', function() {
        populateCartModal();
    });
});
