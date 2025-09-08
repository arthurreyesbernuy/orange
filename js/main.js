// js/main.js

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

    // Elementos del modal de checkout
    const checkoutModal = document.getElementById('checkout-modal');
    const modalTotalSpan = document.getElementById('modal-total');
    const closeBtn = document.querySelector('.close-btn');

    // Elementos del modal de modificadores
    const modifiersModal = document.getElementById('modifiers-modal');
    const modifiersTitle = document.getElementById('modifiers-title');
    const modifiersListContainer = document.getElementById('modifiers-list-container');
    const closeBtnMod = document.querySelector('.close-btn-mod');
    const minusQtyBtn = document.getElementById('minus-qty-btn');
    const plusQtyBtn = document.getElementById('plus-qty-btn');
    const productQtySpan = document.getElementById('product-qty');
    const modifiersTotalSpan = document.getElementById('modifiers-total');
    const addModToCartBtn = document.getElementById('add-to-cart-mod-btn');

    // Elementos de navegación
    const userProfileLink = document.getElementById('user-profile-link');
    const authLink = document.getElementById('auth-link');
    const logoutLink = document.getElementById('logout-link');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    let cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];
    let currentProduct = {}; // Objeto para almacenar el producto actual en el modal de modificadores

    // Lógica para mostrar/ocultar enlaces de navegación según el estado de la sesión
    if (isLoggedIn) {
        if (userProfileLink) userProfileLink.style.display = 'block';
        if (authLink) authLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'block';
    } else {
        if (userProfileLink) userProfileLink.style.display = 'none';
        if (authLink) authLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'none';
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
                console.log(response);
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
        console.log("*displayProducts*");
        console.log(products);
        if (products.length === 0) {
            productListDiv.innerHTML = '<p>No hay productos en esta categoría.</p>';
            return;
        }
        productListDiv.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            // Determinar si el producto tiene modificadores (simulado por ahora)
            // En una implementación real, esto vendría del API
            const hasModifiers = product.hasModifiers; 

            const buttonHtml = hasModifiers
                ? `<button class="customize-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price.toFixed(2)}">Personalizar</button>`
                : `<button class="add-to-cart-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price.toFixed(2)}">Añadir al Carrito</button>`;

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <span class="product-price">S/ ${product.price.toFixed(2)}</span>
                    ${buttonHtml}
                </div>
            `;
            productListDiv.appendChild(productCard);
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.dataset.id);
                const productName = event.target.dataset.name;
                const productPrice = parseFloat(event.target.dataset.price);
                addToCart(productId, productName, productPrice, 1, []);
                alert(`${productName} añadido al carrito.`);
            });
        });

        document.querySelectorAll('.customize-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const productId = parseInt(event.target.dataset.id);
                const productName = event.target.dataset.name;
                const productPrice = parseFloat(event.target.dataset.price);
                await showModifiersModal(productId, productName, productPrice);
            });
        });
    }

    function renderCart() {
        cartItemsDiv.innerHTML = '';
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p>Tu carrito está vacío.</p>';
            checkoutButton.disabled = true;
            cartTotalSpan.textContent = 'S/ 0.00';
            cartCountSpan.textContent = 0;
            saveCart();
            return;
        }

        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            const modifiersHtml = item.modifiers && item.modifiers.length > 0
                ? `<p class="modifiers-list">Modificadores: ${item.modifiers.map(m => m.name).join(', ')}</p>`
                : '';
            cartItemDiv.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    ${modifiersHtml}
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
    function addToCart(productId, productName, productPrice, quantity, modifiers) {
        const existingItem = cart.find(item => item.id === productId && JSON.stringify(item.modifiers) === JSON.stringify(modifiers));

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: quantity,
                modifiers: modifiers
            });
        }
        renderCart();
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
        
        // Obtenemos los datos del usuario logueado
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        // Creamos y llenamos el formulario dinámicamente
        const paymentForm = document.getElementById('payment-form-campos');
        paymentForm.innerHTML = ''; // Limpiamos campos anteriores
        
        // Agregamos los campos ocultos
        const fields = {
            "vads_action_mode": "INTERACTIVE",
            "vads_amount": totalAmount * 100, // En céntimos
            "vads_ctx_mode": "TEST", // o PRODUCTION
            "vads_currency": 604, // Código ISO para PEN (Soles peruanos)
            "vads_cust_address": currentUser.address,
            "vads_cust_city": "Lima", // Estos datos deben venir del usuario
            "vads_cust_country": "PE", // Estos datos deben venir del usuario
            "vads_cust_email": currentUser.email,
            "vads_cust_first_name": currentUser.name.split(' ')[0], // Asumimos que el primer nombre es el primer string
            "vads_cust_last_name": currentUser.name.split(' ').slice(1).join(' '), // El resto del nombre
            "vads_cust_national_id": "44773858", // Este dato debe venir del usuario
            "vads_cust_phone": currentUser.phone,
            "vads_cust_state": "Lima", // Estos datos deben venir del usuario
            "vads_cust_zip": "", // Este dato debe venir del usuario
            "vads_order_id": "ORD" + Math.floor(Math.random() * 1000000),
            "vads_page_action": "PAYMENT",
            "vads_payment_config": "SINGLE",
            "vads_redirect_success_timeout": 5,
            "vads_return_mode": "POST",
            "vads_site_id": "48576921", // ID de tienda
            "vads_trans_date": new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3),
            "vads_trans_id": (Math.random() * 1000000).toFixed(0),
            "vads_url_return": "https://orangefood.com.pe/result.php",
            "vads_version": "V2"
        };
        
        // Ahora agregamos los campos al formulario
        for (const key in fields) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = fields[key];
            paymentForm.appendChild(input);
        }

        // const pagarButton = document.createElement('button');
        // pagarButton.classList.add('btn', 'btn-primary');
        // pagarButton.type = 'submit';
        // pagarButton.name = 'pagar';
        // pagarButton.textContent = 'Pagar';

        // paymentForm.appendChild(pagarButton);

        checkoutModal.style.display = 'block';
    }

    async function processPaymentAndOrder() {
        // ... (Tu lógica de pago, sin cambios)
    }

    // --- Lógica del modal de modificadores ---
    async function showModifiersModal(productId, productName, productPrice) {
        currentProduct = {
            id: productId,
            name: productName,
            basePrice: productPrice,
            quantity: 1,
            modifiers: []
        };
        
        modifiersTitle.textContent = `Personalizar: ${productName}`;
        modifiersListContainer.innerHTML = '<p>Cargando modificadores...</p>';
        productQtySpan.textContent = currentProduct.quantity;
        
        try {
            const response = await getModifiersAPI(productId);
            if (response.success && response.data) {
                displayModifiers(response.data);
            } else {
                modifiersListContainer.innerHTML = '<p>No hay modificadores disponibles para este producto.</p>';
            }
        } catch (error) {
            modifiersListContainer.innerHTML = '<p>Error al cargar modificadores.</p>';
            console.error('Error de red o API al cargar modificadores:', error);
        }

        updateModifiersTotal();
        modifiersModal.style.display = 'block';
    }

    function displayModifiers(modifiers) {
        modifiersListContainer.innerHTML = '';
        modifiers.forEach(modifier => {
            const modifierDiv = document.createElement('div');
            modifierDiv.classList.add('modifier-item');
            modifierDiv.innerHTML = `
                <label>
                    <input type="checkbox" data-id="${modifier.id}" data-name="${modifier.title}" data-price="${modifier.price}">
                    ${modifier.title}
                </label>
                <span>${modifier.price > 0 ? `+ S/ ${modifier.price.toFixed(2)}` : ''}</span>
            `;
            modifiersListContainer.appendChild(modifierDiv);
        });

        document.querySelectorAll('#modifiers-modal input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', updateModifiersTotal);
        });
    }

    function updateModifiersTotal() {
        let modifierPrice = 0;
        let selectedModifiers = [];
        document.querySelectorAll('#modifiers-modal input[type="checkbox"]:checked').forEach(checkbox => {
            const price = parseFloat(checkbox.dataset.price);
            const name = checkbox.dataset.name;
            const id = parseInt(checkbox.dataset.id);
            modifierPrice += price;
            selectedModifiers.push({ id, name, price });
        });

        currentProduct.modifiers = selectedModifiers;
        const total = (currentProduct.basePrice + modifierPrice) * currentProduct.quantity;
        modifiersTotalSpan.textContent = `S/ ${total.toFixed(2)}`;
    }

    // --- Event Listeners ---
    backToCategoriesButton.addEventListener('click', () => {
        productsByCategorySection.style.display = 'none';
        categoriesSection.style.display = 'block';
    });

    checkoutButton.addEventListener('click', placeOrder);

    closeBtn.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
    });

    closeBtnMod.addEventListener('click', () => {
        modifiersModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == checkoutModal) {
            checkoutModal.style.display = 'none';
        }
        if (event.target == modifiersModal) {
            modifiersModal.style.display = 'none';
        }
    });

    minusQtyBtn.addEventListener('click', () => {
        if (currentProduct.quantity > 1) {
            currentProduct.quantity--;
            productQtySpan.textContent = currentProduct.quantity;
            updateModifiersTotal();
        }
    });

    plusQtyBtn.addEventListener('click', () => {
        currentProduct.quantity++;
        productQtySpan.textContent = currentProduct.quantity;
        updateModifiersTotal();
    });

    addModToCartBtn.addEventListener('click', () => {
        const totalModifierPrice = currentProduct.modifiers.reduce((sum, mod) => sum + mod.price, 0);
        const finalPrice = currentProduct.basePrice + totalModifierPrice;
        addToCart(currentProduct.id, currentProduct.name, finalPrice, currentProduct.quantity, currentProduct.modifiers);
        alert(`Producto con modificadores añadido al carrito.`);
        modifiersModal.style.display = 'none';
    });

    // --- Inicialización ---
    loadCategories();
    renderCart();
});