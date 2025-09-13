//const API_BASE_URL = 'http://localhost:8083/orange/api/';
const API_BASE_URL = 'https://orangefood.com.pe/api/';

async function getCategoriesAPI() {
    try {
        console.log('API: Obteniendo categorías...');
        const response = await fetch(`${API_BASE_URL}categories`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        return { success: false, message: 'Error de conexión o datos inválidos.' };
    }    
}

async function getProductsByCategoryAPI(categoryId) {
     try {
        console.log('API: Obteniendo categorías...');
        const response = await fetch(`${API_BASE_URL}products?category_id=`+categoryId);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener productos:', error);
        return { success: false, message: 'Error de conexión o datos inválidos.' };
    }
}

async function getModifiersAPI(productId) {
    console.log(`API: Obteniendo modificadores para el producto ${productId}...`);
    const response = await fetch(`api/index.php?resource=modifiers&product_id=${productId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

async function placeOrderAPI(orderData) {
    console.log('API: Enviando pedido...', orderData);
    const response = await fetch(`${API_BASE_URL}order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });
    return await response.json();
}

async function registerUserAPI(userData) {
    console.log('API: Registrando usuario...', userData);
    const response = await fetch(`${API_BASE_URL}register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    return await response.json();
}

async function loginUserAPI(email, password) {
    console.log('API: Iniciando sesión...', { email });
    const response = await fetch(`${API_BASE_URL}login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    return await response.json();
}

async function updateUserProfileAPI(userData) {
    console.log('API: Actualizando perfil...', userData);
    const response = await fetch(`${API_BASE_URL}profile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    return await response.json();
}

async function getUserOrdersAPI(userId) {
    console.log(`API: Obteniendo pedidos para el usuario ${userId}...`);
    const response = await fetch(`${API_BASE_URL}orders?user_id=${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return await response.json();
}

async function confirmOrderAPI(orderData) {
    console.log('API: Confirmando y enviando pedido final...', orderData);
    try {
        const response = await fetch(`${API_BASE_URL}confirm_order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });
        return await response.json();
    } catch (error) {
        console.error('Error al confirmar el pedido:', error);
        return { success: false, message: 'Error de conexión al confirmar el pedido.' };
    }
}

async function getPaymentSignatureAPI(fields) {
    try {
        const response = await fetch(`${API_BASE_URL}get_signature`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fields) 
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching payment signature:', error);
        return { success: false, message: 'Error de conexión.' };
    }
}