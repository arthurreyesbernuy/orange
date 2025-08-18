// public/js/auth.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authTitle = document.getElementById('auth-title');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginBtn = document.getElementById('login-btn');
    const loginError = document.getElementById('login-error');

    const registerNameInput = document.getElementById('register-name');
    const registerEmailInput = document.getElementById('register-email');
    const registerPasswordInput = document.getElementById('register-password');
    const registerAddressInput = document.getElementById('register-address');
    const registerPhoneInput = document.getElementById('register-phone');
    const registerBtn = document.getElementById('register-btn');
    const registerError = document.getElementById('register-error');

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        authTitle.textContent = 'Registrarse';
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        authTitle.textContent = 'Iniciar Sesión';
    });

    loginBtn.addEventListener('click', async () => {
        loginError.style.display = 'none';
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        if (!email || !password) {
            loginError.textContent = 'Por favor, completa todos los campos.';
            loginError.style.display = 'block';
            return;
        }

        try {
            const response = await loginUserAPI(email, password);
            if (response.success) {
                localStorage.setItem('currentUser', JSON.stringify(response.data));
                localStorage.setItem('isLoggedIn', 'true');
                alert('¡Inicio de sesión exitoso!');
                window.location.href = 'index.php';
            } else {
                loginError.textContent = response.message;
                loginError.style.display = 'block';
            }
        } catch (error) {
            loginError.textContent = 'Error de conexión. Inténtalo de nuevo más tarde.';
            loginError.style.display = 'block';
            console.error('Error de login:', error);
        }
    });

    registerBtn.addEventListener('click', async () => {
        registerError.style.display = 'none';
        const name = registerNameInput.value;
        const email = registerEmailInput.value;
        const password = registerPasswordInput.value;
        const address = registerAddressInput.value;
        const phone = registerPhoneInput.value;

        if (!name || !email || !password || !address || !phone) {
            registerError.textContent = 'Por favor, completa todos los campos.';
            registerError.style.display = 'block';
            return;
        }

        const newUser = { name, email, password, address, phone };

        try {
            const response = await registerUserAPI(newUser);
            if (response.success) {
                alert('¡Registro exitoso! Ya puedes iniciar sesión.');
                showLoginLink.click();
            } else {
                registerError.textContent = response.message;
                registerError.style.display = 'block';
            }
        } catch (error) {
            registerError.textContent = 'Error de conexión. Inténtalo de nuevo más tarde.';
            registerError.style.display = 'block';
            console.error('Error de registro:', error);
        }
    });
});