<?php
// api/index.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

//$netcoreApiUrl = 'http://localhost:55581/api/Web';
$netcoreApiUrl = 'http://190.119.63.91:8083/api/Web';

// Simulación de una base de datos de usuarios y pedidos en la sesión
session_start();

$orders = $_SESSION['orders'] ?? [];

function saveOrders($orders) {
    $_SESSION['orders'] = $orders;
}

$resource = $_GET['resource'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($resource) {
    case 'categories':
        if ($method === 'GET') {
            $ch = curl_init($netcoreApiUrl.'/Categoria_Sellst_Activo');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            http_response_code($httpCode);
            echo $response;
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
        }
        break;

    case 'products':
        if ($method === 'GET') {
            $categoryId = $_GET['category_id'] ?? null;
            if ($categoryId) {
                // Reenviar la solicitud a la API de NetCore con el ID de la categoría
                $ch = curl_init($netcoreApiUrl.'/Productos_Sellst_Por_Categoria_Activo?category_id='.$categoryId);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

                $response = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);

                http_response_code($httpCode);
                echo $response;
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID de categoría no proporcionado.']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
        }
        break;

    case 'modifiers':
        if ($method === 'GET') {
            $productId = $_GET['product_id'] ?? null;
            if ($productId) {
                // Reenviar la solicitud a la API de NetCore con el ID del producto
                $ch = curl_init($netcoreApiUrl . '/Modificadores_Sellst_By_Producto?product_id=' . $productId);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

                $response = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);

                http_response_code($httpCode);
                echo $response;
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID de producto no proporcionado.']);
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
                $ch = curl_init($netcoreApiUrl.'/Ins_Usuario');
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($input));
                curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

                $response = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);

                http_response_code($httpCode);
                echo $response;
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
                $ch = curl_init($netcoreApiUrl.'/Sel_Usuario_Valida');
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($input));
                curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

                $response = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);

                http_response_code($httpCode);
                echo $response;
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
        if ($method === 'POST') {
            if ($input && isset($input['id'])) {
                $userId = $input['id'];
                $found = true;                           

                $ch = curl_init($netcoreApiUrl.'/Usuario_Upd');
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($input));
                curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

                $response = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);             
                                
                unset($user['password']);
                echo json_encode(['success' => true, 'message' => 'Perfil actualizado con éxito.', 'data' => $user]);              
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
?>