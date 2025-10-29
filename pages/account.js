import { auth } from '../utils/auth.js';
import { renderNavbar } from '../components/navbar.js';

export function renderAccountPage() {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;

    if (!auth.isLoggedIn()) {
        window.location.hash = '#login';
        return;
    }
    const user = auth.getUser();

    appContent.innerHTML = `
        <div class="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Akun Saya</h2>
        <p class="text-lg mb-6 text-gray-600 dark:text-gray-300">Selamat datang, <strong class="text-primary">${user?.username || 'Pengguna'}</strong>!</p>

        <button
            id="logout-button"
            class="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md
                hover:bg-red-700 transition-all duration-200
                transform hover:-translate-y-0.5 hover:shadow-lg"
        >
            Logout
        </button>
        </div>
    `;

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            auth.logout();
            renderNavbar();
            alert('Anda telah logout.');
            window.location.hash = '#home';
        });
    }
}