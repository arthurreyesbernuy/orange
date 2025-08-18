// public/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const categoryListDiv = document.getElementById('category-list');
    const productsByCategorySection = document.getElementById('products-by-category');
    const productListDiv = document.getElementById('product-list');
    const currentCategoryTitle = document.getElementById('current-category-title');
    const backToCategoriesButton = document.getElementById('back-to-categories');
    const cartCountSpan = document.getElementById('cart-count');
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const categoriesSection = document.getElementById('categories');

    // Elementos del modal
    const checkoutModal = document.getElementById('checkout-modal');
    const modalTotalSpan = document.getElementById('modal-total');
    //const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
    const closeBtn = document.querySelector('.close-btn');

    // Elementos de navegación
    const userProfileLink = document.getElementById('user-profile-link');
    const authLink = document.getElementById('auth-link');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    let cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];

    // Lógica para mostrar/ocultar enlaces de navegación según el estado de la sesión
    if (isLoggedIn) {
        if (userProfileLink) userProfileLink.style.display = 'block';
        if (authLink) authLink.style.display = 'none';
    } else {
        if (userProfileLink) userProfileLink.style.display = 'none';
        if (authLink) authLink.style.display = 'block';
    }

    // --- Funciones de Carga de Datos ---
    async function loadCategories() {
        categoryListDiv.innerHTML = '<p>Cargando categorías...</p>';
        try {
            const response = await getCategoriesAPI();
            if (response.success) {
                displayCategories(response.data);
            } else {
                categoryListDiv.innerHTML = '<p>Error al cargar categorías.</p>';
                console.error('Error al cargar categorías:', response.message);
            }
        } catch (error) {
            categoryListDiv.innerHTML = '<p>Error de conexión al cargar categorías.</p>';
            console.error('Error de red o API:', error);
        }
    }

    async function loadProductsByCategory(categoryId, categoryName) {
        currentCategoryTitle.textContent = `Productos de ${categoryName}`;
        productListDiv.innerHTML = '<p>Cargando productos...</p>';
        categoriesSection.style.display = 'none';
        productsByCategorySection.style.display = 'block';

        try {
            const response = await getProductsByCategoryAPI(categoryId);
            if (response.success) {
                displayProducts(response.data);
            } else {
                productListDiv.innerHTML = '<p>Error al cargar productos.</p>';
                console.error('Error al cargar productos:', response.message);
            }
        } catch (error) {
            productListDiv.innerHTML = '<p>Error de conexión al cargar productos.</p>';
            console.error('Error de red o API:', error);
        }
    }

    // --- Funciones de Renderizado ---
    function displayCategories(categories) {
        if (categories.length === 0) {
            categoryListDiv.innerHTML = '<p>No hay categorías disponibles.</p>';
            return;
        }
        categoryListDiv.innerHTML = '';
        categories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.classList.add('category-card');
            categoryCard.innerHTML = `
                <img src="${category.image}" alt="${category.name}">
                <h3>${category.name}</h3>
            `;
            categoryCard.addEventListener('click', () => {
                loadProductsByCategory(category.id, category.name);
            });
            categoryListDiv.appendChild(categoryCard);
        });
    }

    function displayProducts(products) {
        if (products.length === 0) {
            productListDiv.innerHTML = '<p>No hay productos en esta categoría.</p>';
            return;
        }
        productListDiv.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <span class="product-price">S/ ${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" data-id="${product.id}"
                            data-name="${product.name}"
                            data-price="${product.price.toFixed(2)}">Añadir al Carrito</button>
                </div>
            `;
            productListDiv.appendChild(productCard);
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    function renderCart() {
        cartItemsDiv.innerHTML = '';
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p>Tu carrito está vacío.</p>';
            checkoutButton.disabled = true;
            cartTotalSpan.textContent = 'S/ 0.00';
            cartCountSpan.textContent = 0;
            return;
        }

        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>S/ ${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="item-quantity">
                    <button class="remove-from-cart-btn" data-id="${item.id}">Eliminar</button>
                </div>
            `;
            cartItemsDiv.appendChild(cartItemDiv);
        });

        cartTotalSpan.textContent = `S/ ${total.toFixed(2)}`;
        cartCountSpan.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        checkoutButton.disabled = false;

        document.querySelectorAll('.item-quantity').forEach(input => {
            input.addEventListener('change', updateCartQuantity);
        });
        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });

        saveCart();
    }

    // --- Funciones del Carrito ---
    function addToCart(event) {
        const productId = parseInt(event.target.dataset.id);
        const productName = event.target.dataset.name;
        const productPrice = parseFloat(event.target.dataset.price);

        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
        }
        renderCart();
        alert(`${productName} añadido al carrito.`);
    }

    function updateCartQuantity(event) {
        const productId = parseInt(event.target.dataset.id);
        const newQuantity = parseInt(event.target.value);

        if (newQuantity <= 0) {
            removeFromCart({ target: { dataset: { id: productId } } });
            return;
        }

        const itemToUpdate = cart.find(item => item.id === productId);
        if (itemToUpdate) {
            itemToUpdate.quantity = newQuantity;
            renderCart();
        }
    }

    function removeFromCart(event) {
        const productId = parseInt(event.target.dataset.id);
        const originalLength = cart.length;
        cart = cart.filter(item => item.id !== productId);
        if (cart.length < originalLength) {
            alert('Producto eliminado del carrito.');
        }
        renderCart();
    }

    function saveCart() {
        localStorage.setItem('restaurantCart', JSON.stringify(cart));
    }

    // Modificamos la función placeOrder para que muestre el modal en lugar de procesar directamente
    async function placeOrder() {
        if (!isLoggedIn) {
            alert('Debes iniciar sesión para finalizar tu pedido.');
            window.location.href = 'auth.php';
            return;
        }

        if (cart.length === 0) {
            alert('El carrito está vacío. Añade productos antes de finalizar el pedido.');
            return;
        }

        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        modalTotalSpan.textContent = `Total a pagar: S/ ${totalAmount.toFixed(2)}`;
        checkoutModal.style.display = 'block';
    }

    // Nueva función para procesar el pago y el pedido, que se llamará desde el modal
    async function processPaymentAndOrder() {
        confirmPaymentBtn.disabled = true;
        confirmPaymentBtn.textContent = 'Procesando...';

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        const orderDetails = cart.map(item => ({
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
            pricePerUnit: item.price
        }));

        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const order = {
            userId: currentUser.id,
            userName: currentUser.name,
            userAddress: currentUser.address,
            userPhone: currentUser.phone,
            items: orderDetails,
            total: totalAmount.toFixed(2),
            timestamp: new Date().toISOString()
        };

        try {
            const response = await placeOrderAPI(order);
            if (response.success) {
                alert(`Pedido realizado con éxito!\nID de Pedido: ${response.orderId}\nTotal: S/ ${order.total}`);
                cart = [];
                renderCart();
                checkoutModal.style.display = 'none'; // Cerrar el modal
            } else {
                alert(`Error al procesar el pedido: ${response.message || 'Inténtalo de nuevo.'}`);
                console.error('Error al finalizar pedido:', response.message);
            }
        } catch (error) {
            alert('Error de conexión al intentar finalizar el pedido. Revisa tu conexión.');
            console.error('Error de red o API al finalizar pedido:', error);
        } finally {
            confirmPaymentBtn.disabled = false;
            confirmPaymentBtn.textContent = 'Confirmar y Pagar';
        }
    }

    // --- Event Listeners ---
    backToCategoriesButton.addEventListener('click', () => {
        productsByCategorySection.style.display = 'none';
        categoriesSection.style.display = 'block';
    });

    checkoutButton.addEventListener('click', placeOrder);

    // Eventos del modal
    closeBtn.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == checkoutModal) {
            checkoutModal.style.display = 'none';
        }
    });

    //confirmPaymentBtn.addEventListener('click', processPaymentAndOrder);

    // --- Inicialización ---
    loadCategories();
    renderCart();
});