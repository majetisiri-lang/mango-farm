// ===== PRODUCT DATA =====
const products = [
  {
    id: 1,
    name: 'Alphonso',
    emoji: '🥭',
    origin: 'Ratnagiri, Maharashtra',
    desc: 'The king of mangoes. Rich, creamy texture with a sweet-tangy aroma. GI-tagged from Ratnagiri.',
    price: 599,
    size: '1 kg box',
    badge: 'Best Seller',
  },
  {
    id: 2,
    name: 'Kesar',
    emoji: '🥭',
    origin: 'Junagadh, Gujarat',
    desc: 'Bright saffron pulp with a melt-in-the-mouth sweetness. Ideal for desserts and milkshakes.',
    price: 399,
    size: '1 kg box',
    badge: 'Popular',
  },
  {
    id: 3,
    name: 'Dasheri',
    emoji: '🥭',
    origin: 'Malihabad, Uttar Pradesh',
    desc: 'Elongated, fibreless, and incredibly juicy. A favourite across North India.',
    price: 299,
    size: '1 kg box',
    badge: null,
  },
  {
    id: 4,
    name: 'Langra',
    emoji: '🥭',
    origin: 'Varanasi, Uttar Pradesh',
    desc: 'Thin-skinned with a distinctive tangy flavour. A classic summer treat.',
    price: 249,
    size: '1 kg box',
    badge: null,
  },
  {
    id: 5,
    name: 'Alphonso Box (5 kg)',
    emoji: '📦',
    origin: 'Ratnagiri, Maharashtra',
    desc: 'Our premium Alphonso mangoes in a 5 kg family pack. Perfect for gifting.',
    price: 2499,
    size: '5 kg box',
    badge: 'Value Pack',
  },
  {
    id: 6,
    name: 'Kesar Box (5 kg)',
    emoji: '📦',
    origin: 'Junagadh, Gujarat',
    desc: 'Five kilograms of the finest Kesar mangoes — great for juices and aamras.',
    price: 1799,
    size: '5 kg box',
    badge: null,
  },
  {
    id: 7,
    name: 'Mixed Variety Gift Box',
    emoji: '🎁',
    origin: 'Pan India',
    desc: 'A curated selection of Alphonso, Kesar, and Dasheri — the perfect mango gift.',
    price: 999,
    size: '3 kg assorted',
    badge: 'Gift',
  },
  {
    id: 8,
    name: 'Chaunsa',
    emoji: '🥭',
    origin: 'Punjab',
    desc: 'Honey-sweet with a buttery texture. Late-season favourite with a long shelf life.',
    price: 349,
    size: '1 kg box',
    badge: 'New',
  },
  {
    id: 9,
    name: 'Kotthapalli Kobbari Pacchadi Kayalu',
    emoji: '🥭',
    origin: 'Kotthapalli, Andhra Pradesh',
    desc: 'A rare local variety known for its unique coconut-chutney flavour profile. Prized in Andhra households.',
    price: 399,
    size: '1 kg box',
    badge: 'Local Special',
  },
  {
    id: 10,
    name: 'Banginpalli',
    emoji: '🥭',
    origin: 'Banganapalle, Andhra Pradesh',
    desc: 'GI-tagged variety with a golden-yellow skin, fibreless pulp, and a mild sweet taste. Perfect for eating fresh.',
    price: 299,
    size: '1 kg box',
    badge: 'GI Tagged',
  },
  {
    id: 11,
    name: 'Panduru Mamidi Rasalu',
    emoji: '🥭',
    origin: 'Andhra Pradesh',
    desc: 'Juicy and aromatic with a distinctly sweet, sherbet-like flavour. Best enjoyed chilled straight from the fruit.',
    price: 449,
    size: '1 kg box',
    badge: 'Farm Favourite',
  },
  {
    id: 12,
    name: 'Chilakamukku Kayalu',
    emoji: '🥭',
    origin: 'Andhra Pradesh',
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
        <span style="font-size:5rem;">${product.emoji}</span>
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
