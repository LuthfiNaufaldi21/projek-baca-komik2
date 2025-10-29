import { auth } from '../utils/auth.js';
import { renderNavbar } from '../components/navbar.js';

export function renderLoginPage() {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;

    appContent.innerHTML = `
        <div class="max-w-md mx-auto mt-10 p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <h2 id="form-title" class="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">Login</h2>
        <form id="auth-form" class="space-y-4">
            <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <input type="text" id="username" required class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
            </div>
            <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input type="password" id="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
            </div>
            <div id="confirm-password-field" class="hidden">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
            <input type="password" id="confirm-password" class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
            </div>

            <button
            type="submit"
            id="submit-button"
            class="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md
                    hover:bg-primary-hover transition-all duration-200
                    transform hover:-translate-y-0.5 hover:shadow-lg"
            >
            Login
            </button>
        </form>
        <p id="toggle-auth" class="mt-4 text-center text-sm text-primary hover:underline cursor-pointer">
            Belum punya akun? Daftar di sini
        </p>
        </div>
    `;

    const toggleLink = document.getElementById('toggle-auth');
    const formTitle = document.getElementById('form-title');
    const submitButton = document.getElementById('submit-button');
    const confirmPasswordField = document.getElementById('confirm-password-field');
    const confirmPasswordInput = document.getElementById('confirm-password');
    let isLoginView = true;

    if (toggleLink) {
        toggleLink.addEventListener('click', () => {
            isLoginView = !isLoginView;
            if (isLoginView) {
                if (formTitle) formTitle.textContent = 'Login';
                if (submitButton) submitButton.textContent = 'Login';
                toggleLink.textContent = 'Belum punya akun? Daftar di sini';
                confirmPasswordField?.classList.add('hidden');
                if (confirmPasswordInput) confirmPasswordInput.required = false;
            } else {
                if (formTitle) formTitle.textContent = 'Sign Up';
                if (submitButton) submitButton.textContent = 'Sign Up';
                toggleLink.textContent = 'Sudah punya akun? Login di sini';
                confirmPasswordField?.classList.remove('hidden');
                if (confirmPasswordInput) confirmPasswordInput.required = true;
            }
        });
    }


    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirm-password');

            const username = usernameInput.value;
            const password = passwordInput.value;


            if (isLoginView) {
            if (!username || !password) {
                alert('Username dan password harus diisi!');
                return;
            }
            auth.login(username);
            renderNavbar();
            alert('Login Berhasil!');
            window.location.hash = '#akun';
            } else {
            const confirmPassword = confirmPasswordInput.value;
            if (!username || !password || !confirmPassword) {
                alert('Semua field harus diisi!');
                return;
            }
            if (password !== confirmPassword) {
                alert('Password dan konfirmasi password tidak cocok!');
                return;
            }
            auth.login(username);
            renderNavbar();
            alert('Pendaftaran Berhasil!');
            window.location.hash = '#akun';
            }
        });
    }
}