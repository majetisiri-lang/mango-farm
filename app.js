// ===== PRODUCT DATA =====
const products = [
  // Rasalu
  { id: 1,  name: 'Cheruku Rasalu',      category: 'rasalu',       origin: 'Narsapur, Andhra Pradesh', desc: 'Sweet as sugarcane juice — this variety is beloved for its exceptionally high sugar content and juicy, sherbet-like pulp.', price: 150, size: '1 kg box', badge: null, soldOut: true, images: ['images/products/cheruku-rasalu-1.avif','images/products/cheruku-rasalu-2.webp','images/products/cheruku-rasalu-3.webp','images/products/cheruku-rasalu-4.webp','images/products/cheruku-rasalu-5.jpg','images/products/cheruku-rasalu-6.jpg'] },
  { id: 2,  name: 'Peddha Rasalu',       category: 'rasalu',       origin: 'Narsapur, Andhra Pradesh', desc: 'The large Rasalu — bold in size and flavour, with a rich, aromatic sweetness that fills the palate.', price: 60, size: '1 kg box', badge: null, soldOut: true, images: ['images/products/peddha-rasalu-1.webp','images/products/peddha-rasalu-2.jpg','images/products/peddha-rasalu-3.webp'] },
  { id: 3,  name: 'Chinna Rasalu',       category: 'rasalu',       origin: 'Narsapur, Andhra Pradesh', desc: 'Small but intensely flavoured — Chinna Rasalu packs a punch with its concentrated sweetness and silky texture.', price: 150, size: '1 kg box', badge: null, soldOut: true, images: ['images/products/chinna-rasalu-1.jpg','images/products/chinna-rasalu-2.jpg'] },
  { id: 4,  name: 'Nuzividu Rasalu',     category: 'rasalu',       origin: 'Nuzividu, Andhra Pradesh', desc: 'Grown in the renowned Nuzividu belt, prized for its silky smooth pulp and perfectly balanced sweet-aromatic flavour.', price: 150, size: '1 kg box', badge: null, soldOut: true, images: ['images/products/nuzividu-rasalu-1.jpg','images/products/nuzividu-rasalu-2.webp','images/products/nuzividu-rasalu-3.webp','images/products/nuzividu-rasalu-4.webp'] },
  // Pickles
  { id: 5,  name: 'Kotthapalli Kobbari Avakay', category: 'pickles', origin: 'Narsapur, Andhra Pradesh', desc: 'Andhra-style raw mango pickle made from Kotthapalli Kobbari mangoes — bold, spicy, and packed with authentic farm flavour.', price: 150, size: '500 g jar', badge: null, soldOut: true, images: ['images/products/kothapalli-kobbari-1.webp','images/products/kothapalli-kobbari-2.jpg','images/products/kothapalli-kobbari-3.jpeg'] },
  { id: 6,  name: 'Desavali Magai',      category: 'pickles',      origin: 'Narsapur, Andhra Pradesh', desc: 'Traditional Desavali mango magai — slow-pickled with mustard, red chilli, and sesame oil. A classic of Andhra kitchens.', price: 150, size: '500 g jar', badge: null, soldOut: true, images: ['images/products/desavali-1.avif','images/products/desavali-2.avif','images/products/desavali-3.avif','images/products/desavali-4.avif','images/products/desavali-5.avif'] },
  // Kotha Kayalu
  { id: 7,  name: 'Imam Pasandh',       category: 'kotha-kayalu', origin: 'Narsapur, Andhra Pradesh', desc: 'A premium variety with smooth fibreless pulp and a rich, honeyed sweetness. A true connoisseur\'s mango.', price: 150, size: '1 kg box', badge: null, soldOut: true, images: ['images/products/imam-pasandh-1.jpg','images/products/imam-pasandh-2.jpg','images/products/imam-pasandh-3.jpeg','images/products/imam-pasandh-4.jpeg'] },
  { id: 8,  name: 'Banginpalli',         category: 'kotha-kayalu', origin: 'Narsapur, Andhra Pradesh', desc: 'GI-tagged variety with golden-yellow skin, fibreless pulp, and a mild sweet taste. Perfect for eating fresh.', price: 65, size: '1 kg box', badge: null, images: ['images/products/banginpalli-1.jpg','images/products/banginpalli-2.jpeg'] },
  { id: 11, name: 'Kesar',               category: 'kotha-kayalu', origin: 'Narsapur, Andhra Pradesh', desc: 'The "Queen of Mangoes" — saffron-coloured pulp with an intense honey-like sweetness and a distinctive floral aroma.', price: 150, size: '1 kg box', badge: null, soldOut: true, images: ['images/products/kesar-1.jpeg','images/products/kesar-2.jpeg','images/products/kesar-3.jpeg','images/products/kesar-4.jpg'] },
  { id: 12, name: 'Cover Banginpalli (Premium)',   category: 'kotha-kayalu', origin: 'Narsapur, Andhra Pradesh', desc: 'Our most sought-after variety — each mango individually hand-covered for flawless ripening. Rich, creamy, and perfectly sweet.', price: 75, size: '1 kg box', badge: '⭐ Best Seller', images: ['images/products/cover-banginpalli-1.jpeg','images/banginpalli.jpg','images/gallery/IMG_20260430_113701235.jpg','images/gallery/IMG_20260430_162426386.jpg','images/gallery/IMG_20260430_162622811.jpg','images/gallery/IMG_20260430_114529068_MF_PORTRAIT.jpg'] },
];

// ===== CART HELPERS =====
function getCart() {
  return JSON.parse(localStorage.getItem('mf_cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('mf_cart', JSON.stringify(cart));
}

const MIN_KG = 5;

function getTotalKg(cart) {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
  const product = products.find(p => p.id === productId);
  showToast(`🥭 ${product.name} added to cart!`);
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('#nav-cart-count').forEach(el => {
    el.textContent = total;
    el.classList.toggle('visible', total > 0);
  });
}

// ===== PRODUCT SLIDESHOW =====
function renderProductSlideshow(product) {
  if (!product.images || !product.images.length) return '';
  const imgs = product.images.map((img, i) =>
    `<img src="${img}" class="slide${i===0?' active':''}" alt="${product.name}" loading="lazy">`
  ).join('');
  const controls = product.images.length > 1 ? `
    <button class="slide-btn slide-prev" onclick="slidePrev(event,'p${product.id}')">&#8249;</button>
    <button class="slide-btn slide-next" onclick="slideNext(event,'p${product.id}')">&#8250;</button>
    <div class="slide-dots">${product.images.map((_,i) =>
      `<span class="dot${i===0?' active':''}" onclick="slideTo(event,'p${product.id}',${i})"></span>`
    ).join('')}</div>` : '';
  return `<div class="product-slideshow" id="ss-p${product.id}">${imgs}${controls}</div>`;
}

function slidePrev(e, id) { e.stopPropagation(); moveSlide(id, -1); }
function slideNext(e, id) { e.stopPropagation(); moveSlide(id, 1); }
function slideTo(e, id, idx) { e.stopPropagation(); setSlide(id, idx); }

function moveSlide(id, dir) {
  const ss = document.getElementById('ss-' + id);
  if (!ss) return;
  const slides = ss.querySelectorAll('.slide');
  const dots = ss.querySelectorAll('.dot');
  const cur = [...slides].findIndex(s => s.classList.contains('active'));
  const next = (cur + dir + slides.length) % slides.length;
  slides[cur].classList.remove('active');
  dots[cur]?.classList.remove('active');
  slides[next].classList.add('active');
  dots[next]?.classList.add('active');
}

function setSlide(id, idx) {
  const ss = document.getElementById('ss-' + id);
  if (!ss) return;
  ss.querySelectorAll('.slide').forEach((s, i) => s.classList.toggle('active', i === idx));
  ss.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === idx));
}

setInterval(() => {
  document.querySelectorAll('.product-slideshow').forEach(ss => {
    if (ss.querySelectorAll('.slide').length > 1) moveSlide(ss.id.replace('ss-', ''), 1);
  });
}, 3500);

// ===== RENDER PRODUCT CARD =====
function renderProductCard(product) {
  return `
    <div class="product-card">
      <div class="product-img">
        ${renderProductSlideshow(product)}
        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
      </div>
      <div class="product-body">
        <div class="product-name">${product.name}</div>
        <div class="product-footer">
          ${product.soldOut
            ? `<div class="product-sold-out">Sold Out</div>`
            : `<div class="product-price">₹${product.price} <span>/ ${product.size}</span></div>
          <button class="add-to-cart" onclick="addToCart(${product.id})" title="Add to cart">+</button>`}
        </div>
      </div>
    </div>`;
}

// ===== NAV DRAWER =====
function toggleDrawer() {
  document.getElementById('nav-drawer').classList.toggle('open');
  document.getElementById('nav-overlay').classList.toggle('show');
}

function initNav() {
  const token = localStorage.getItem('mgf_token');
  const email = localStorage.getItem('mgf_email');
  const loginLink = document.getElementById('drawer-login');
  const accountLink = document.getElementById('drawer-account');
  const drawerBottom = document.getElementById('drawer-bottom');
  if (token && email) {
    if (loginLink) loginLink.style.display = 'none';
    if (accountLink) accountLink.style.display = '';
    if (drawerBottom) drawerBottom.style.display = '';
  }
}

function logoutUser() {
  localStorage.removeItem('mgf_token');
  localStorage.removeItem('mgf_email');
  showToast('Logged out');
  setTimeout(() => window.location.href = 'index.html', 900);
}

// ===== TOAST =====
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}
