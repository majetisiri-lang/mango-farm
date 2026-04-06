// ===== PRODUCT DATA =====
const products = [
  {
    id: 9,
    name: 'Kotthapalli Kobbari Pacchadi Kayalu',
    image: 'images/kotthapalli.jpg',
    origin: 'Narsapur, Andhra Pradesh',
    desc: 'A rare local variety known for its unique coconut-chutney flavour profile. Prized in Andhra households.',
    price: 399,
    size: '1 kg box',
    badge: null,
  },
  {
    id: 10,
    name: 'Banginpalli',
    image: 'images/banginpalli.jpg',
    origin: 'Narsapur, Andhra Pradesh',
    desc: 'GI-tagged variety with a golden-yellow skin, fibreless pulp, and a mild sweet taste. Perfect for eating fresh.',
    price: 299,
    size: '1 kg box',
    badge: null,
  },
  {
    id: 11,
    name: 'Panduru Mamidi Rasalu',
    image: 'images/rasalu.jpg',
    origin: 'Narsapur, Andhra Pradesh',
    desc: 'Juicy and aromatic with a distinctly sweet, sherbet-like flavour. Best enjoyed chilled straight from the fruit.',
    price: 449,
    size: '1 kg box',
    badge: null,
  },
  {
    id: 12,
    name: 'Chilakamukku Kayalu',
    image: 'images/chilakamukku.jpg',
    origin: 'Narsapur, Andhra Pradesh',
    desc: 'Named for its parrot-beak shape, this variety has a firm texture and a balanced sweet-tangy taste.',
    price: 349,
    size: '1 kg box',
    badge: null,
  },
];

// ===== CART HELPERS =====
function getCart() {
  return JSON.parse(localStorage.getItem('mf_cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('mf_cart', JSON.stringify(cart));
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

// ===== RENDER PRODUCT CARD =====
function renderProductCard(product) {
  return `
    <div class="product-card">
      <div class="product-img">
        <img src="${product.image}" alt="${product.name}">
        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
      </div>
      <div class="product-body">
        <div class="product-name">${product.name}</div>
        <div class="product-origin">📍 ${product.origin}</div>
        <div class="product-desc">${product.desc}</div>
        <div class="product-footer">
          <div class="product-price">₹${product.price} <span>/ ${product.size}</span></div>
          <button class="add-to-cart" onclick="addToCart(${product.id})" title="Add to cart">+</button>
        </div>
      </div>
    </div>`;
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
