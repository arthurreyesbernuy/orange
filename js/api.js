// public/js/api.js

//const API_BASE_URL = 'http://localhost:8083/orange/api/';
const API_BASE_URL = 'https://orangefood.com.pe/api/';

// Simulación de datos para la API
const simulatedData = {
    categories: [
        { id: 1, name: 'Entradas', image: 'images/entradas.jpg' },
        { id: 2, name: 'Platos Fuertes', image: 'images/platos_fuertes.jpg' },
        { id: 3, name: 'Postres', image: 'images/postres.jpg' },
        { id: 4, name: 'Bebidas', image: 'images/bebidas.jpg' }
    ],
    products: {
        1: [ // Entradas
            { id: 101, name: 'Ceviche Clásico', description: 'Frescos trozos de pescado marinados en limón, ají limo y cebolla roja.', price: 35.00, image: 'images/ceviche.jpg' },
            { id: 102, name: 'Papa a la Huancaína', description: 'Rodajas de papa sancochada bañadas en salsa de ají amarillo y queso fresco.', price: 18.00, image: 'images/papa_huancaina.jpg' }
        ],
        2: [ // Platos Fuertes
            { id: 201, name: 'Lomo Saltado', description: 'Trozos de lomo fino salteados al wok con cebolla, tomate y papas fritas.', price: 45.00, image: 'images/lomo_saltado.jpg' },
            { id: 202, name: 'Ají de Gallina', description: 'Pechuga de gallina deshilachada en salsa de ají amarillo, pan y nueces.', price: 38.00, image: 'images/aji_gallina.jpg' },
            { id: 203, name: 'Arroz con Pato', description: 'Arroz cremoso con pato confitado y aderezo de culantro.', price: 42.00, image: 'images/arroz_pato.jpg' }
        ],
        3: [ // Postres
            { id: 301, name: 'Suspiro a la Limeña', description: 'Postre tradicional peruano a base de manjar blanco y merengue.', price: 15.00, image: 'images/suspiro_limena.jpg' },
            { id: 302, name: 'Mazamorra Morada', description: 'Dulce de maíz morado con frutas secas y especias.', price: 10.00, image: 'images/mazamorra_morada.jpg' }
        ],
        4: [ // Bebidas
            { id: 401, name: 'Chicha Morada', description: 'Bebida refrescante a base de maíz morado, piña y especias.', price: 8.00, image: 'images/chicha_morada.jpg' },
            { id: 402, name: 'Inca Kola (Lata)', description: 'Gaseosa peruana de sabor único.', price: 6.00, image: 'images/inca_kola.jpg' }
        ]
    }
};

/**
 * Simula la llamada a la API para obtener categorías.
 */
async function getCategoriesAPI() {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('API: Obteniendo categorías...');
            resolve({ success: true, data: simulatedData.categories });
        }, 500);
    });
}

/**
 * Simula la llamada a la API para obtener productos por categoría.
 */
async function getProductsByCategoryAPI(categoryId) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`API: Obteniendo productos para categoría ${categoryId}...`);
            const products = simulatedData.products[categoryId] || [];
            resolve({ success: true, data: products });
        }, 500);
    });
}

/**
 * Simula la llamada a la API para enviar un pedido.
 */
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

/**
 * Simula la llamada a la API para registrar un usuario.
 */
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

/**
 * Simula la llamada a la API para iniciar sesión.
 */
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

/**
 * Simula la llamada a la API para actualizar el perfil del usuario.
 */
async function updateUserProfileAPI(userData) {
    console.log('API: Actualizando perfil...', userData);
    const response = await fetch(`${API_BASE_URL}profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    return await response.json();
}

/**
 * Nueva función: Simula la llamada a la API para obtener los pedidos de un usuario.
 */
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