<?php
require_once "keys.php";

// $parameters = dataForm();

// ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orange Food Truck</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootswatch@4.5.2/dist/journal/bootstrap.min.css"
        integrity="sha384-QDSPDoVOoSWz2ypaRUidLmLYl4RyoBWI44iA5agn6jHegBxZkNqgm2eHb6yZ5bYs" crossorigin="anonymous" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</head>
<body>
    <header>
        <nav>
            <div class="logo">Orange Food Truck</div>
            <ul>
                <li><a href="index.php">Inicio</a></li>
                <li><a href="#categories">Menú</a></li>
                <li><a href="#cart">Carrito (<span id="cart-count">0</span>)</a></li>
                <li><a href="user_profile.php" id="user-profile-link" style="display:none;">Mi Perfil</a></li>
                <li><a href="auth.php" id="auth-link">Mi Cuenta</a></li>
                <li><a href="logout.php" id="logout-link" style="display:none;">Cerrar Sesión</a></li>
            </ul>
        </nav>
        <div class="banner" id="home">
            <h1>¡Sabores que te Conquistan!</h1>
            <p>Descubre nuestros deliciosos platillos, hechos con pasión.</p>
        </div>
    </header>

    <main>
        <section id="categories" class="categories-section">
            <h2>Nuestras Categorías</h2>
            <div id="category-list" class="category-list">
                <p>Cargando categorías...</p>
            </div>
        </section>

        <section id="products-by-category" class="products-by-category-section" style="display: none;">
            <h2 id="current-category-title">Productos de la Categoría</h2>
            <div id="product-list" class="product-list">
            </div>
            <button id="back-to-categories">← Volver a Categorías</button>
        </section>

        <section id="cart" class="cart-section">
            <h2>Tu Carrito de Compras</h2>
            <div id="cart-items" class="cart-items">
                <p>Tu carrito está vacío.</p>
            </div>
            <div class="cart-summary">
                <p>Total: <span id="cart-total">S/ 0.00</span></p>
                <button id="checkout-button" class="btn-checkout" disabled>Finalizar Pedido</button>
            </div>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 Orange Food Truck. Todos los derechos reservados.</p>
    </footer>

    <div id="checkout-modal" class="modal">
        <form action="https://secure.micuentaweb.pe/vads-payment/" method="post" id="payment-form">
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <h3>Resumen de tu Pedido</h3>
                <p id="modal-total">Total a pagar: S/ 0.00</p>
                <div id="payment-form-campos"></div>
                <button class="btn btn-primary" type="submit" name="pagar">Pagar</button>
            </div>
        </form>
    </div>

    <div id="modifiers-modal" class="modal">
        <div class="modal-content">
            <span class="close-btn-mod">&times;</span>
            <h3 id="modifiers-title"></h3>
            <div id="modifiers-list-container">
                <p>Cargando modificadores...</p>
            </div>
            <div class="quantity-controls">
                <button id="minus-qty-btn">-</button>
                <span id="product-qty">1</span>
                <button id="plus-qty-btn">+</button>
            </div>
            <p>Precio total: <span id="modifiers-total">S/ 0.00</span></p>
            <button id="add-to-cart-mod-btn" class="btn-confirm-payment">Añadir al Carrito</button>
        </div>
    </div>

    <script src="js/api.js"></script>
    <script src="js/main.js"></script>
</body>
</html>