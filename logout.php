<?php
session_start();
session_unset();
session_destroy();
setcookie("PHPSESSID", "", time() - 3600, "/");

// Opcional: limpiar datos del carrito y usuario en el lado del cliente (localStorage)
// La página de inicio lo hará automáticamente, pero esto es una buena práctica.
echo "<script>";
echo "localStorage.removeItem('currentUser');";
echo "localStorage.removeItem('isLoggedIn');";
echo "localStorage.removeItem('restaurantCart');";
echo "window.location.href = 'index.php';";
echo "</script>";
?>