document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const switchToLogin = document.getElementById('switch-to-login');
    
    // Set login as default active tab
    loginTab.classList.add('active-tab');
    
    // Switch to register tab
    registerTab.addEventListener('click', function() {
        loginTab.classList.remove('active-tab');
        registerTab.classList.add('active-tab');
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });
    
    // Switch to login tab
    loginTab.addEventListener('click', function() {
        registerTab.classList.remove('active-tab');
        loginTab.classList.add('active-tab');
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });
    
    // Switch from register form to login
    switchToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        registerTab.classList.remove('active-tab');
        loginTab.classList.add('active-tab');
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });
    
    // Basic form validation examples
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const loginEmailError = document.getElementById('login-email-error');
    const loginPasswordError = document.getElementById('login-password-error');
    
    loginEmail.addEventListener('blur', function() {
        if (!loginEmail.value.includes('@') || !loginEmail.value.includes('.')) {
            loginEmailError.classList.remove('hidden');
        } else {
            loginEmailError.classList.add('hidden');
        }
    });
    
    loginPassword.addEventListener('blur', function() {
        if (loginPassword.value.length < 6) {
            loginPasswordError.classList.remove('hidden');
        } else {
            loginPasswordError.classList.add('hidden');
        }
    });
    
    // Register form validation would go here similarly
    
    // Feather icons replacement (in case dynamic content is added)
    document.addEventListener('feather.replace', function() {
        feather.replace();
    });
});