const API = '';
const CLOUDINARY_CLOUD = 'djch8jrwh';
const CLOUDINARY_PRESET = 'lvbkoi8n';

let currentUser = null;
let cartItems = [];
let allProducts = [];
let selectedRole = 'customer';

async function uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
        method: 'POST',
        body: formData
    });
    const data = await res.json();
    return data.secure_url;
}

function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    if (page === 'home') loadProducts();
    if (page === 'cart') loadCart();
    if (page === 'orders') loadOrders();
    if (page === 'seller') loadSellerProducts();
    if (page === 'admin') loadAdmin();
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function selectRole(role, el) {
    selectedRole = role;
    document.querySelectorAll('.role-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    document.getElementById('reg-role').value = role;
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    try {
        const res = await fetch(`${API}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (res.ok) {
            currentUser = await res.json();
            updateNavbar();
            showToast('Welcome back, ' + currentUser.username);
            showPage('home');
        } else {
            document.getElementById('login-error').textContent = 'Invalid email or password';
        }
    } catch (e) {
        document.getElementById('login-error').textContent = 'Connection error';
    }
}

async function register() {
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;
    try {
        const res = await fetch(`${API}/api/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role })
        });
        if (res.ok) {
            showToast('Account created! Please login.');
            showPage('login');
        } else {
            document.getElementById('reg-error').textContent = 'Registration failed';
        }
    } catch (e) {
        document.getElementById('reg-error').textContent = 'Connection error';
    }
}

function logout() {
    currentUser = null;
    cartItems = [];
    document.getElementById('cart-count').textContent = '0';
    document.getElementById('auth-links').innerHTML =
        `<a href="#" onclick="showPage('login')" class="btn-nav">Login</a>`;
    showToast('Logged out successfully');
    showPage('home');
}

function updateNavbar() {
    const sellerLink = currentUser.role === 'seller'
        ? `<a href="#" onclick="showPage('seller')">My Store</a>` : '';
    const adminLink = currentUser.role === 'admin'
        ? `<a href="#" onclick="showPage('admin')">Admin</a>` : '';
    document.getElementById('auth-links').innerHTML =
        `${sellerLink}
         ${adminLink}
         <span style="color:var(--accent);font-size:0.875rem;font-weight:600;padding:0.5rem">${currentUser.username}</span>
         <a href="#" onclick="logout()">Logout</a>`;
}

async function loadProducts() {
    try {
        const res = await fetch(`${API}/api/products`);
        allProducts = await res.json();
        renderProducts(allProducts);
    } catch (e) {
        document.getElementById('products-grid').innerHTML =
            '<div class="loading-spinner">Could not load products</div>';
    }
}

function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    if (products.length === 0) {
        grid.innerHTML = '<div class="loading-spinner">No products found</div>';
        return;
    }
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-img">
                ${p.imageUrl
                    ? `<img src="${p.imageUrl}" alt="${p.name}" onerror="this.parentElement.innerHTML='🛍️'">`
                    : '🛍️'}
            </div>
            <div class="product-body">
                <div class="product-category">${p.category || 'General'}</div>
                <div class="product-name">${p.name}</div>
                <div class="product-desc">${p.description || ''}</div>
                <div class="product-footer">
                    <div class="product-price">$${parseFloat(p.price).toFixed(2)}</div>
                    <div class="product-stock">${p.stock} left</div>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${p.id}, '${p.name}', ${p.price})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function filterProducts(category, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (category === 'all') renderProducts(allProducts);
    else renderProducts(allProducts.filter(p => p.category === category));
}

function addToCart(productId, name, price) {
    if (!currentUser) { showToast('Please login to add items'); showPage('login'); return; }
    if (currentUser.role === 'seller') { showToast('Sellers cannot buy products'); return; }
    const existing = cartItems.find(i => i.productId === productId);
    if (existing) { existing.quantity++; }
    else { cartItems.push({ productId, name, price, quantity: 1 }); }
    document.getElementById('cart-count').textContent = cartItems.reduce((s, i) => s + i.quantity, 0);
    showToast(`${name} added to cart`);
}

async function loadCart() {
    const container = document.getElementById('cart-items');
    const summary = document.getElementById('cart-summary');
    if (cartItems.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>Your cart is empty</h3><p>Add some products to get started</p></div>';
        summary.style.display = 'none';
        return;
    }
    const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    container.innerHTML = cartItems.map((item, idx) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${parseFloat(item.price).toFixed(2)} × ${item.quantity}</div>
            </div>
            <div style="display:flex;align-items:center;gap:1rem">
                <span style="font-weight:700">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="btn-danger" onclick="removeFromCart(${idx})">Remove</button>
            </div>
        </div>
    `).join('');
    document.getElementById('cart-total').textContent = '$' + total.toFixed(2);
    summary.style.display = 'block';
}

function removeFromCart(idx) {
    cartItems.splice(idx, 1);
    document.getElementById('cart-count').textContent = cartItems.reduce((s, i) => s + i.quantity, 0);
    loadCart();
}

async function placeOrder() {
    if (!currentUser) { showToast('Please login first'); return; }
    const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    try {
        const orderRes = await fetch(`${API}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: { id: currentUser.id }, totalPrice: total })
        });
        const order = await orderRes.json();
        for (const item of cartItems) {
            await fetch(`${API}/api/orders/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order: { id: order.id },
                    product: { id: item.productId },
                    quantity: item.quantity,
                    price: item.price
                })
            });
        }
        cartItems = [];
        document.getElementById('cart-count').textContent = '0';
        showToast('Order placed successfully!');
        showPage('orders');
    } catch (e) {
        showToast('Failed to place order');
    }
}

async function loadOrders() {
    if (!currentUser) {
        document.getElementById('orders-list').innerHTML =
            '<div class="empty-state"><h3>Please login</h3><p>Sign in to view your orders</p></div>';
        return;
    }
    try {
        const res = await fetch(`${API}/api/orders/user/${currentUser.id}`);
        const orders = await res.json();
        if (orders.length === 0) {
            document.getElementById('orders-list').innerHTML =
                '<div class="empty-state"><h3>No orders yet</h3><p>Your orders will appear here</p></div>';
            return;
        }
        document.getElementById('orders-list').innerHTML = orders.map(o => `
            <div class="order-card">
                <div>
                    <div class="order-id">ORDER #${o.id}</div>
                    <div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.25rem">
                        ${new Date(o.orderedAt).toLocaleDateString()}
                    </div>
                </div>
                <div class="order-total">$${parseFloat(o.totalPrice).toFixed(2)}</div>
                <div class="order-status">${o.status}</div>
            </div>
        `).join('');
    } catch (e) {
        showToast('Could not load orders');
    }
}

async function loadSellerProducts() {
    if (!currentUser) return;
    try {
        const res = await fetch(`${API}/api/products/seller/${currentUser.id}`);
        const products = await res.json();
        document.getElementById('admin-products-list').innerHTML = products.length > 0
            ? products.map(p => `
                <div class="admin-product-row">
                    <div>
                        <div style="font-weight:600">${p.name}</div>
                        <div style="color:var(--text-muted);font-size:0.8rem">${p.category} — $${p.price}</div>
                    </div>
                    <button class="btn-danger" onclick="deleteProduct(${p.id})">Delete</button>
                </div>
            `).join('')
            : '<div style="color:var(--text-muted);padding:1rem">No products yet</div>';
    } catch(e) {
        showToast('Could not load products');
    }
}

async function addProduct() {
    const imageFile = document.getElementById('prod-image').files[0];
    let imageUrl = '';
    if (imageFile) {
        document.getElementById('admin-msg').textContent = 'Uploading image...';
        try {
            imageUrl = await uploadImage(imageFile);
        } catch (e) {
            document.getElementById('admin-msg').textContent = 'Image upload failed';
            return;
        }
    }
    const product = {
        name: document.getElementById('prod-name').value,
        description: document.getElementById('prod-desc').value,
        price: parseFloat(document.getElementById('prod-price').value),
        stock: parseInt(document.getElementById('prod-stock').value),
        category: document.getElementById('prod-category').value,
        imageUrl: imageUrl,
        sellerId: currentUser.id
    };
    try {
        const res = await fetch(`${API}/api/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        if (res.ok) {
            document.getElementById('admin-msg').textContent = 'Product added!';
            document.getElementById('prod-name').value = '';
            document.getElementById('prod-desc').value = '';
            document.getElementById('prod-price').value = '';
            document.getElementById('prod-stock').value = '';
            document.getElementById('prod-image').value = '';
            loadSellerProducts();
            showToast('Product added!');
        }
    } catch (e) {
        showToast('Failed to add product');
    }
}

async function deleteProduct(id) {
    if (!currentUser) return;
    try {
        await fetch(`${API}/api/products/${id}?sellerId=${currentUser.id}`, { method: 'DELETE' });
        showToast('Product deleted');
        loadSellerProducts();
        loadProducts();
    } catch (e) {
        showToast('Failed to delete product');
    }
}

async function loadAdmin() {
    try {
        const [products, orders, users] = await Promise.all([
            fetch(`${API}/api/admin/products`).then(r => r.json()),
            fetch(`${API}/api/admin/orders`).then(r => r.json()),
            fetch(`${API}/api/admin/users`).then(r => r.json())
        ]);
        document.getElementById('admin-products-list-full').innerHTML = products.map(p => `
            <div class="admin-product-row">
                <div>
                    <div style="font-weight:600">${p.name}</div>
                    <div style="color:var(--text-muted);font-size:0.8rem">${p.category} — $${p.price}</div>
                </div>
                <button class="btn-danger" onclick="deleteProduct(${p.id})">Delete</button>
            </div>
        `).join('') || '<div style="color:var(--text-muted);padding:1rem">No products</div>';
        document.getElementById('admin-orders-list').innerHTML = orders.map(o => `
            <div class="admin-product-row">
                <div>
                    <div style="font-weight:600">Order #${o.id}</div>
                    <div style="color:var(--text-muted);font-size:0.8rem">$${o.totalPrice}</div>
                </div>
                <span class="order-status">${o.status}</span>
            </div>
        `).join('') || '<div style="color:var(--text-muted);padding:1rem">No orders</div>';
        document.getElementById('admin-users-list').innerHTML = users.map(u => `
            <div class="admin-product-row">
                <div>
                    <div style="font-weight:600">${u.username}</div>
                    <div style="color:var(--text-muted);font-size:0.8rem">${u.email}</div>
                </div>
                <span style="font-size:0.75rem;background:var(--accent-light);color:var(--accent);padding:0.2rem 0.6rem;border-radius:20px;font-weight:600">${u.role}</span>
            </div>
        `).join('') || '<div style="color:var(--text-muted);padding:1rem">No users</div>';
    } catch (e) {
        showToast('Could not load admin data');
    }
}

loadProducts();