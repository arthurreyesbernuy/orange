<?php
// api/index.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Simulación de una base de datos de usuarios y pedidos en la sesión
session_start();
$users = $_SESSION['users'] ?? [];
$orders = $_SESSION['orders'] ?? [];

function saveUsers($users) {
    $_SESSION['users'] = $users;
}

function saveOrders($orders) {
    $_SESSION['orders'] = $orders;
}

// Simulación de datos (normalmente vendrían de una base de datos)
$simulatedData = [
    'categories' => [
        ['id' => 1, 'name' => 'Entradas', 'image' => 'images/entradas.jpg'],
        ['id' => 2, 'name' => 'Platos Fuertes', 'image' => 'images/platos_fuertes.jpg'],
        ['id' => 3, 'name' => 'Postres', 'image' => 'images/postres.jpg'],
        ['id' => 4, 'name' => 'Bebidas', 'image' => 'images/bebidas.jpg']
    ],
    'products' => [
        1 => [ // Entradas
            ['id' => 101, 'name' => 'Ceviche Clásico', 'description' => 'Frescos trozos de pescado marinados en limón, ají limo y cebolla roja.', 'price' => 35.00, 'image' => 'images/ceviche.jpg'],
            ['id' => 102, 'name' => 'Papa a la Huancaína', 'description' => 'Rodajas de papa sancochada bañadas en salsa de ají amarillo y queso fresco.', 'price' => 18.00, 'image' => 'images/papa_huancaina.jpg']
        ],
        2 => [ // Platos Fuertes
            ['id' => 201, 'name' => 'Lomo Saltado', 'description' => 'Trozos de lomo fino salteados al wok con cebolla, tomate y papas fritas.', 'price' => 45.00, 'image' => 'images/lomo_saltado.jpg'],
            ['id' => 202, 'name' => 'Ají de Gallina', 'description' => 'Pechuga de gallina deshilachada en salsa de ají amarillo, pan y nueces.', 'price' => 38.00, 'image' => 'images/aji_gallina.jpg'],
            ['id' => 203, 'name' => 'Arroz con Pato', 'description' => 'Arroz cremoso con pato confitado y aderezo de culantro.', 'price' => 42.00, 'image' => 'images/arroz_pato.jpg']
        ],
        3 => [ // Postres
            ['id' => 301, 'name' => 'Suspiro a la Limeña', 'description' => 'Postre tradicional peruano a base de manjar blanco y merengue.', 'price' => 15.00, 'image' => 'images/suspiro_limena.jpg'],
            ['id' => 302, 'name' => 'Mazamorra Morada', 'description' => 'Dulce de maíz morado con frutas secas y especias.', 'price' => 10.00, 'image' => 'images/mazamorra_morada.jpg']
        ],
        4 => [ // Bebidas
            ['id' => 401, 'name' => 'Chicha Morada', 'description' => 'Bebida refrescante a base de maíz morado, piña y especias.', 'price' => 8.00, 'image' => 'images/chicha_morada.jpg'],
            ['id' => 402, 'name' => 'Inca Kola (Lata)', 'description' => 'Gaseosa peruana de sabor único.', 'price' => 6.00, 'image' => 'images/inca_kola.jpg']
        ]
    ]
];

$resource = $_GET['resource'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($resource) {
    case 'categories':
        if ($method === 'GET') {
            echo json_encode(['success' => true, 'data' => $simulatedData['categories']]);
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
        }
        break;

    case 'products':
        if ($method === 'GET') {
            $categoryId = $_GET['category_id'] ?? null;
            if ($categoryId && isset($simulatedData['products'][$categoryId])) {
                echo json_encode(['success' => true, 'data' => $simulatedData['products'][$categoryId]]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Categoría de productos no encontrada.']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
        }
        break;

    case 'order':
        if ($method === 'POST') {
            if ($input && isset($input['items']) && is_array($input['items']) && !empty($input['items'])) {
                $orderId = uniqid('ORD_');
                $input['orderId'] = $orderId;
                $orders[] = $input;
                saveOrders($orders);
                echo json_encode(['success' => true, 'message' => 'Pedido recibido con éxito.', 'orderId' => $orderId, 'received_data' => $input]);
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Datos de pedido inválidos.']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
        }
        break;
    
    // Nuevo endpoint para obtener pedidos de un usuario
    case 'orders':
        if ($method === 'GET') {
            $userId = $_GET['user_id'] ?? null;
            if ($userId) {
                $userOrders = array_filter($orders, function($order) use ($userId) {
                    return isset($order['userId']) && $order['userId'] == $userId;
                });
                echo json_encode(['success' => true, 'data' => array_values($userOrders)]);
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID de usuario no proporcionado.']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
        }
        break;

    case 'register':
        if ($method === 'POST') {
            if ($input && isset($input['email'], $input['password'], $input['name'], $input['address'], $input['phone'])) {
                $email = strtolower($input['email']);
                $userExists = false;
                foreach ($users as $user) {
                    if ($user['email'] === $email) {
                        $userExists = true;
                        break;
                    }
                }
                if ($userExists) {
                    http_response_code(409);
                    echo json_encode(['success' => false, 'message' => 'El correo electrónico ya está registrado.']);
                } else {
                    $newUserId = count($users) + 1;
                    $users[] = [
                        'id' => $newUserId,
                        'name' => $input['name'],
                        'email' => $email,
                        'password' => password_hash($input['password'], PASSWORD_DEFAULT),
                        'address' => $input['address'],
                        'phone' => $input['phone']
                    ];
                    saveUsers($users);
                    echo json_encode(['success' => true, 'message' => 'Registro exitoso.']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Datos de registro incompletos.']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
        }
        break;

    case 'login':
        if ($method === 'POST') {
            if ($input && isset($input['email'], $input['password'])) {
                $email = strtolower($input['email']);
                $user = null;
                foreach ($users as $u) {
                    if ($u['email'] === $email) {
                        $user = $u;
                        break;
                    }
                }
                if ($user && password_verify($input['password'], $user['password'])) {
                    unset($user['password']);
                    echo json_encode(['success' => true, 'message' => 'Inicio de sesión exitoso.', 'data' => $user]);
                } else {
                    http_response_code(401);
                    echo json_encode(['success' => false, 'message' => 'Correo o contraseña incorrectos.']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Datos de inicio de sesión incompletos.']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
        }
        break;

    case 'profile':
        if ($method === 'PUT') {
            if ($input && isset($input['id'])) {
                $userId = $input['id'];
                $found = false;
                foreach ($users as &$user) {
                    if ($user['id'] == $userId) {
                        $user['name'] = $input['name'] ?? $user['name'];
                        $user['address'] = $input['address'] ?? $user['address'];
                        $user['phone'] = $input['phone'] ?? $user['phone'];
                        $found = true;
                        break;
                    }
                }
                if ($found) {
                    saveUsers($users);
                    unset($user['password']);
                    echo json_encode(['success' => true, 'message' => 'Perfil actualizado con éxito.', 'data' => $user]);
                } else {
                    http_response_code(404);
                    echo json_encode(['success' => false, 'message' => 'Usuario no encontrado.']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID de usuario no proporcionado.']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Recurso no encontrado.']);
        break;
}