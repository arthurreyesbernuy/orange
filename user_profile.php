<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Perfil - Orange Food Truck</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .profile-container, .orders-container {
            max-width: 600px;
            margin: 4rem auto 2rem;
            padding: 2rem;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .profile-container h2, .orders-container h2 {
            text-align: center;
            margin-bottom: 2rem;
        }
        .profile-info {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        .profile-info label {
            font-weight: bold;
        }
        .profile-info input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .profile-actions {
            text-align: center;
        }
        .profile-actions button {
            padding: 10px 20px;
            margin: 0 5px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
        }
        #update-profile-btn {
            background-color: #007bff;
            color: white;
        }
        #update-profile-btn:hover {
            background-color: #0056b3;
        }
        #logout-btn {
            background-color: #dc3545;
            color: white;
        }
        #logout-btn:hover {
            background-color: #c82333;
        }
        #update-success, #update-error {
            text-align: center;
            margin-top: 1rem;
            font-weight: bold;
        }
        #update-success {
            color: green;
        }
        #update-error {
            color: red;
        }
        .order-item {
            border-bottom: 1px solid #eee;
            padding: 1rem 0;
        }
        .order-item:last-child {
            border-bottom: none;
        }
        .order-item h4 {
            margin: 0 0 0.5rem;
            color: #ff6600;
        }
        .order-item ul {
            list-style: none;
            padding: 0;
        }
        .order-item li {
            font-size: 0.9rem;
            color: #555;
            margin-bottom: 0.2rem;
        }
        .order-item p {
            font-weight: bold;
            text-align: right;
            margin: 0;
            color: #333;
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <div class="logo">Orange Food Truck</div>
            <ul>
                <li><a href="index.php">Inicio</a></li>
                <li><a href="#cart">Carrito</a></li>
                <li><a href="logout.php" id="logout-link">Cerrar Sesión</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section class="profile-container">
            <h2>Mi Perfil</h2>
            <div class="profile-info" id="profile-info-display">
                <label for="profile-name">Nombres:</label>
                <input type="text" id="profile-name">

                <label for="profile-apellidos">Apellidos:</label>
                <input type="text" id="profile-apellidos">

                <label for="numero-documento">DNI/CEX/PAS:</label>
                <input type="text" id="numero-documento">

                <label for="profile-email">Correo:</label>
                <input type="email" id="profile-email">

                <label for="profile-address">Dirección:</label>
                <input type="text" id="profile-address">

                <label for="profile-ciudad">Ciudad:</label>
                <input type="text" id="profile-ciudad">

                <label for="profile-phone">Teléfono:</label>
                <input type="tel" id="profile-phone">

                
            </div>
            <div class="profile-actions">
                <button id="update-profile-btn">Actualizar Datos</button>
            </div>
            <p id="update-success" style="display: none;">Datos actualizados con éxito.</p>
            <p id="update-error" style="display: none;"></p>
        </section>

        <section class="orders-container">
            <h2>Mis Pedidos</h2>
            <div id="order-list">
                <p>Cargando pedidos...</p>
            </div>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 Orange Food Truck. Todos los derechos reservados.</p>
    </footer>

    <script src="js/api.js"></script>
    <script src="js/user_profile.js"></script>
</body>
</html>