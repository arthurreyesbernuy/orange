<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro e Inicio de Sesión</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .auth-container {
            max-width: 400px;
            margin: 4rem auto;
            padding: 2rem;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .auth-container h2 {
            text-align: center;
            margin-bottom: 2rem;
        }
        .auth-container input {
            width: 100%;
            padding: 10px;
            margin-bottom: 1rem;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
        }
        .auth-container button {
            width: 100%;
            padding: 10px;
            background-color: #ff6600;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
        }
        .auth-container button:hover {
            background-color: #e65c00;
        }
        .form-toggle {
            text-align: center;
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <div class="logo">Orange Food Truck</div>
            <ul>
                <li><a href="index.php">Inicio</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section class="auth-container">
            <h2 id="auth-title">Iniciar Sesión</h2>
            <div id="login-form">
                <input type="email" id="login-email" placeholder="Correo Electrónico" required>
                <input type="password" id="login-password" placeholder="Contraseña" required>
                <button id="login-btn">Iniciar Sesión</button>
                <p id="login-error" style="color: red; text-align: center; margin-top: 1rem; display: none;"></p>
                <p class="form-toggle">¿No tienes cuenta? <a href="#" id="show-register">Regístrate aquí</a></p>
            </div>

            <div id="register-form" style="display: none;">
                <input type="text" id="register-name" placeholder="Nombre Completo" required>
                <input type="email" id="register-email" placeholder="Correo Electrónico" required>
                <input type="password" id="register-password" placeholder="Contraseña" required>
                <input type="text" id="register-address" placeholder="Dirección" required>
                <input type="tel" id="register-phone" placeholder="Teléfono" required>
                <button id="register-btn">Registrarse</button>
                <p id="register-error" style="color: red; text-align: center; margin-top: 1rem; display: none;"></p>
                <p class="form-toggle">¿Ya tienes cuenta? <a href="#" id="show-login">Inicia sesión</a></p>
            </div>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2025 Orange Food Truck. Todos los derechos reservados.</p>
    </footer>

    <script src="js/api.js"></script>
    <script src="js/auth.js"></script>
</body>
</html>