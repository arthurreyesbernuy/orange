// public/js/user_profile.js
// Variable global para el mapa y el marcador
let map;
let marker;

const defaultCoords = { lat: -8.123758, lng: -79.038812 }; // Lima, Perú

const addressListDiv = document.getElementById('address-list');
const addAddressBtn = document.getElementById('add-address-btn');

// Modal
const addressModal = document.getElementById('address-modal');
const modalTitle = document.getElementById('modal-title');
const closeBtn = document.querySelector('.close-btn');
const addressIdInput = document.getElementById('address-id');
const addressNameInput = document.getElementById('address-name');
const addressFullInput = document.getElementById('address-full');
const addressLatInput = document.getElementById('address-lat');
const addressLngInput = document.getElementById('address-lng');
const saveAddressBtn = document.getElementById('save-address-btn');
function initMap() {
    map = new google.maps.Map(document.getElementById("map-modal"), {
        zoom: 15,
        center: defaultCoords,
    });
    marker = new google.maps.Marker({
        position: defaultCoords,
        map: map,
        draggable: true,
    });
    marker.addListener("dragend", (e) => updateCoords(e.latLng.lat(), e.latLng.lng()));
    map.addListener("click", (e) => {
        marker.setPosition(e.latLng);
        updateCoords(e.latLng.lat(), e.latLng.lng());
    });
}

function updateCoords(lat, lng) {
    addressLatInput.value = lat.toFixed(6);
    addressLngInput.value = lng.toFixed(6);
}

function setMapLocation(lat, lng) {
    const newPos = new google.maps.LatLng(lat, lng);
    map.setCenter(newPos);
    marker.setPosition(newPos);
    updateCoords(lat, lng);
}

// --- LÓGICA DE DIRECCIONES ---
function renderAddresses() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    addressListDiv.innerHTML = '';
    if (!currentUser.addresses || currentUser.addresses.length === 0) {
        addressListDiv.innerHTML = '<p>No tienes direcciones guardadas.</p>';
        return;
    }
    currentUser.addresses.forEach(addr => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('address-list-item');
        itemDiv.innerHTML = `
            <div class="address-info">
                <p class="name">${addr.nombre}</p>
                <p>${addr.direccionCompleta}</p>
                <p class="coords">Lat: ${addr.latitud}, Lng: ${addr.longitud}</p>
            </div>
            <div class="address-actions">
                <button class="edit-btn" data-id="${addr.id}">Editar</button>
                <button class="delete-btn" data-id="${addr.id}">Eliminar</button>
            </div>
        `;
        addressListDiv.appendChild(itemDiv);
    });
}

async function loadAddresses() {    
    renderAddresses();
}

function openModalForNew() {
    modalTitle.textContent = "Agregar Nueva Dirección";
    addressIdInput.value = '';
    addressNameInput.value = '';
    addressFullInput.value = '';
    setMapLocation(defaultCoords.lat, defaultCoords.lng);
    addressModal.style.display = 'block';
}

function openModalForEdit(addressId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const address = currentUser.addresses.find(a => a.id == addressId);
    if (!address) return;

    modalTitle.textContent = "Editar Dirección";
    addressIdInput.value = address.id;
    addressNameInput.value = address.nombre;
    addressFullInput.value = address.direccionCompleta;
    setMapLocation(parseFloat(address.latitud), parseFloat(address.longitud));
    addressModal.style.display = 'block';
}

async function saveAddress() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const addressData = {
        nombre: addressNameInput.value,
        direccionCompleta: addressFullInput.value,
        latitud: addressLatInput.value,
        longitud: addressLngInput.value,
        userId: currentUser.id
    };

    const addressId = addressIdInput.value;
    let response;

    if (addressId) { // Estamos editando
        console.log("updateAddressAPI");
        response = await updateAddressAPI(addressId, addressData);
    } else { // Estamos creando
        console.log("addAddressAPI");
        response = await addAddressAPI(addressData);
    }

    if (response.success) {
        // Actualizar la lista de direcciones localmente y re-renderizar
        // En una app real, la respuesta de la API debería devolver la lista actualizada
        alert('Dirección guardada!');
        updateCurrentUserAddresses(response.data);
        
        addressModal.style.display = 'none';
        // Aquí deberías recargar las direcciones desde la API
        // loadAddresses(); 
    } else {
        alert(`Error: ${response.message}`);
    }
}

async function deleteAddress(addressId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta dirección?')) return;
    
    const response = await deleteAddressAPI(addressId);
    if (response.success) {
        alert('Dirección eliminada.');
        updateCurrentUserAddresses(response.data);        
    } else {
        alert(`Error: ${response.message}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const profileNameInput = document.getElementById('profile-name');
    const profileApellidosInput = document.getElementById('profile-apellidos');
    const profileNumeroDocumentoInput = document.getElementById('numero-documento');
    const profileEmailInput = document.getElementById('profile-email');        
    const profilePhoneInput = document.getElementById('profile-phone');
    const updateProfileBtn = document.getElementById('update-profile-btn');
    // const logoutBtn = document.getElementById('logout-btn');
    const updateSuccess = document.getElementById('update-success');
    const updateError = document.getElementById('update-error');
    const orderListDiv = document.getElementById('order-list');
    
    loadAddresses();

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        alert('Debes iniciar sesión para ver tu perfil.');
        window.location.href = 'auth.php';
        return;
    }

    // Listeners de botones
    addAddressBtn.addEventListener('click', openModalForNew);
    saveAddressBtn.addEventListener('click', saveAddress);
    closeBtn.addEventListener('click', () => addressModal.style.display = 'none');
    
    addressListDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-btn')) {
            openModalForEdit(event.target.dataset.id);
        }
        if (event.target.classList.contains('delete-btn')) {
            deleteAddress(event.target.dataset.id);
        }
    });

    // Rellenar los campos del perfil
    profileNameInput.value = currentUser.name;
    profileApellidosInput.value = currentUser.apellidos;
    profileNumeroDocumentoInput.value = currentUser.numerodocumento;
    profileEmailInput.value = currentUser.email;    
    profilePhoneInput.value = currentUser.phone;    

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

    // logoutBtn.addEventListener('click', () => {
    //     localStorage.removeItem('currentUser');
    //     localStorage.removeItem('isLoggedIn');
    //     window.location.href = 'index.php';
    // });
    
    // Carga los pedidos al iniciar la página
    loadUserOrders();
});


async function addAddressAPI(addressData) {
    // Asume que tu endpoint para crear es /addresses y método POST
    const response = await fetch(`${API_BASE_URL}addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData)
    });
    return await response.json();
}

async function updateAddressAPI(addressId, addressData) {
    // Asume que tu endpoint para actualizar es /addresses/{id} y método PUT
    const response = await fetch(`${API_BASE_URL}addresses/${addressId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData)
    });
    return await response.json();
}

async function deleteAddressAPI(addressId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const response = await fetch(`${API_BASE_URL}addresses/${addressId}/${currentUser.id}`, {
        method: 'DELETE'
    });
    return await response.json();
}

function updateCurrentUserAddresses(newAddresses) {    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
    currentUser.addresses = newAddresses;    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    renderAddresses();
}