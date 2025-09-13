<?php
require_once "keys.php";

$payment_success = false;
$order_id = 'N/A';
$error_message = 'Unkown error.';

if (empty($_POST)) {
  $error_message = "No se recibieron datos del pago.";
} elseif (!checkSignature($_POST)) { // Validación de firma
  $error_message = "Firma de pago inválida. La transacción no es segura.";
} elseif (isset($_POST['vads_trans_status']) && $_POST['vads_trans_status'] === 'AUTHORISED') {
  $payment_success = true;
  $order_id = $_POST['vads_order_id'];
} else {
  $error_message = "El pago fue rechazado o cancelado. Estado: " . ($_POST['vads_trans_status'] ?? 'DESCONOCIDO');
}

?>
<!DOCTYPE html>
<html>
<head>
  <title>Resultado de tu Pedido</title>
  <link rel="stylesheet" href="css/style.css" />
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    .result-container { max-width: 600px; margin: 4rem auto; padding: 2rem; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center; }
    .success { color: #28a745; }
    .error { color: #dc3545; }
    .loader { border: 4px solid #f3f3f3; border-top: 4px solid #ff6600; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <header>
    <nav><div class="logo"><a href="/" style="color:#ff6600 !important">Orange Food Truck</a></div></nav>
  </header>
  
  <div class="result-container" id="result-container">
    <?php if ($payment_success): ?>
      <h2 class="success">¡Pago Exitoso!</h2>
      <p>Estamos procesando tu pedido, por favor no cierres esta ventana.</p>
      <p><strong>ID de Pedido:</strong> <?= htmlspecialchars($order_id) ?></p>
      <div class="loader" id="loader"></div>
      <p id="status-message"></p>
    <?php else: ?>
      <h2 class="error">Error en el Pago</h2>
      <p><?= htmlspecialchars($error_message) ?></p>
      <a href="index.php">Volver al inicio</a>
    <?php endif; ?>
  </div>

  <script src="js/api.js"></script>
  <script>
    // Solo ejecutar si el pago fue exitoso
    const postData = <?= json_encode($_POST, JSON_PRETTY_PRINT); ?>;
    
    // Muestra los datos en la consola del navegador
    console.log("Datos recibidos de la pasarela de pago:", postData);
    // --- FIN DEL NUEVO CÓDIGO ---

    <?php if ($payment_success): ?>
      document.addEventListener('DOMContentLoaded', async () => {
        const statusMessage = document.getElementById('status-message');
        const loader = document.getElementById('loader');

        try {
          statusMessage.textContent = 'Recuperando datos del carrito...';
          const cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];
          const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
          
          if (cart.length === 0) {
            throw new Error("El carrito está vacío. El pedido ya podría haber sido procesado.");
          }

          const orderData = {
            orderId: '<?= htmlspecialchars($order_id) ?>',
            userId: currentUser.id,
            items: cart,
            paymentDetails: { // Puedes añadir más detalles del POST aquí
              amount: <?= (int)$_POST['vads_amount'] / 100 ?>,
              status: '<?= htmlspecialchars($_POST['vads_trans_status']) ?>',
              card_brand: '<?= htmlspecialchars($_POST['vads_card_brand'] ?? 'N/A') ?>'
            }
          };

          statusMessage.textContent = 'Enviando pedido a la cocina...';
          const response = await confirmOrderAPI(orderData);

          if (response.success) {
            statusMessage.textContent = '¡Pedido confirmado! Tu comida está en camino.';
            localStorage.removeItem('restaurantCart'); // Limpiar el carrito
            loader.style.display = 'none';
            document.getElementById('result-container').innerHTML += '<a href="index.php">Excelente, volver al inicio</a>';
          } else {
            throw new Error(response.message || 'Hubo un error al confirmar el pedido.');
          }

        } catch (error) {
          loader.style.display = 'none';
          statusMessage.textContent = `Error: ${error.message}`;
          statusMessage.classList.add('error');
        }
      });
    <?php endif; ?>
  </script>
</body>
</html>