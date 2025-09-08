// public/js/user_profile.js

document.addEventListener('DOMContentLoaded', () => {
    const profileNameInput = document.getElementById('profile-name');
    const profileApellidosInput = document.getElementById('profile-apellidos');
    const profileNumeroDocumentoInput = document.getElementById('numero-documento');
    const profileEmailInput = document.getElementById('profile-email');
    const profileAddressInput = document.getElementById('profile-address');
    const profileCiudadInput = document.getElementById('profile-ciudad');
    const profilePhoneInput = document.getElementById('profile-phone');
    const updateProfileBtn = document.getElementById('update-profile-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const updateSuccess = document.getElementById('update-success');
    const updateError = document.getElementById('update-error');
    const orderListDiv = document.getElementById('order-list');

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        alert('Debes iniciar sesión para ver tu perfil.');
        window.location.href = 'auth.php';
        return;
    }

    // Rellenar los campos del perfil
    profileNameInput.value = currentUser.name;
    profileApellidosInput.value = currentUser.apellidos;
    profileNumeroDocumentoInput.value = currentUser.numerodocumento;
    profileEmailInput.value = currentUser.email;
    profileAddressInput.value = currentUser.address;
    profilePhoneInput.value = currentUser.phone;
    profileCiudadInput.value = currentUser.ciudad;

    // Cargar y mostrar los pedidos del usuario
    async function loadUserOrders() {
        orderListDiv.innerHTML = '<p>Cargando pedidos...</p>';
        try {
            const response = await getUserOrdersAPI(currentUser.id);
            if (response.success) {
                if (response.data.length === 0) {
                    orderListDiv.innerHTML = '<p>No tienes pedidos registrados.</p>';
                } else {
                    displayOrders(response.data);
                }
            } else {
                orderListDiv.innerHTML = '<p>Error al cargar los pedidos.</p>';
                console.error('Error al cargar pedidos:', response.message);
            }
        } catch (error) {
            orderListDiv.innerHTML = '<p>Error de conexión al cargar pedidos.</p>';
            console.error('Error de red o API:', error);
        }
    }

    function displayOrders(orders) {
        orderListDiv.innerHTML = '';
        orders.forEach(order => {
            const orderItemDiv = document.createElement('div');
            orderItemDiv.classList.add('order-item');
            const itemsList = order.items.map(item => `<li>${item.quantity}x ${item.productName} (S/ ${item.pricePerUnit.toFixed(2)})</li>`).join('');
            orderItemDiv.innerHTML = `
                <h4>Pedido ID: ${order.orderId}</h4>
                <p>Fecha: ${new Date(order.timestamp).toLocaleString()}</p>
                <p><strong>Total: S/ ${parseFloat(order.total).toFixed(2)}</strong></p>
                <ul>
                    ${itemsList}
                </ul>
            `;
            orderListDiv.appendChild(orderItemDiv);
        });
    }

    updateProfileBtn.addEventListener('click', async () => {
        updateSuccess.style.display = 'none';
        updateError.style.display = 'none';

        const updatedUser = {
            id: currentUser.id,
            name: profileNameInput.value,
            apellidos: profileApellidosInput.value,
            numerodocumento: profileNumeroDocumentoInput.value,
            email: profileEmailInput.value,
            ciudad: profileCiudadInput.value,
            address: profileAddressInput.value,
            phone: profilePhoneInput.value
        };

        try {
            const response = await updateUserProfileAPI(updatedUser);
            if (response.success) {
                localStorage.setItem('currentUser', JSON.stringify(response.data));
                updateSuccess.style.display = 'block';
            } else {
                updateError.textContent = response.message;
                updateError.style.display = 'block';
            }
        } catch (error) {
            updateError.textContent = 'Error de conexión. Inténtalo de nuevo.';
            updateError.style.display = 'block';
            console.error('Error al actualizar perfil:', error);
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'index.php';
    });
    
    // Carga los pedidos al iniciar la página
    loadUserOrders();
});