import { auth } from "../utils/auth.js";
import { renderNavbar } from "../components/navbar.js";

export function renderLoginPage() {
  const appContent = document.getElementById("app-content");
  if (!appContent) return;

  appContent.innerHTML = `
    <div class="bg-white dark:bg-gray-900">
        <div class="login-split-container">
            <div class="login-image-panel">
                <div class="image-overlay-content">
                    <h1 class="text-4xl font-bold text-white" style="font-family: 'Playfair Display', serif;">KomiKita</h1>
                    <p class="text-white mt-4 max-w-sm text-center">Tempat seru membaca komik aduhay, menghadirkan cerita seru, gambar no burik burik, update cepat, dan pengalaman membaca yang selalu bikin ketagihan</p>
                </div>
            </div>
            <div class="login-form-panel dark:bg-gray-800">
                <div class="w-full max-w-md">
                    <div class="text-center">
                        <h2 class="text-4xl font-bold text-[#4a56e2]">Salam, pecinta komik</h2>
                        <p class="text-gray-500 mt-2 dark:text-gray-300">Masuk dengan email</p>
                    </div>
                    <form id="auth-form" class="mt-8 space-y-6">
                        <div class="relative">
                            <label for="email" class="block text-xs font-medium text-gray-500 dark:text-gray-300">Alamat email </label>
                            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pt-4">
                                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                            </span>
                            <input type="email" id="email" required class="pl-10 mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900">
                        </div>
                        <div class="relative">
                            <div class="flex justify-between items-center">
                                <label for="password" class="block text-xs font-medium text-gray-500 dark:text-gray-300">Password</label>
                            </div>
                             <span class="absolute inset-y-0 left-0 flex items-center pl-3 pt-4">
                                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" /></svg>
                            </span>
                            <input type="password" id="password" required class="pl-10 mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900">
                            <a href="#" class="text-xs text-gray-500 hover:underline absolute right-0 -bottom-5 dark:text-gray-300">Lupa passwordmu?</a>
                        </div>
                        <div id="confirm-password-field" class="hidden relative">
                            <label class="block text-xs font-medium text-gray-500 dark:text-gray-300">Konfirmasi Password mu</label>
                            <input type="password" id="confirm-password" class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900">
                        </div>

                        <button type="submit" id="submit-button" class="w-full py-3 px-4 bg-[#4a56e2] text-white font-semibold rounded-md hover:bg-blue-600 transition-all duration-200 transform hover:shadow-lg">
                            LOGIN
                        </button>
                    </form>
                    
                    <div class="or-separator-light">
                        <span>Bisa juga dengan</span>
                    </div>

                    <div class="flex justify-center space-x-4">
                        <button class="social-icon-btn"><img src="https://www.google.com/favicon.ico" alt="Google" class="h-6 w-6"></button>
                        <button class="social-icon-btn"><img src="https://www.facebook.com/favicon.ico" alt="Facebook" class="h-6 w-6"></button>
                        <button class="social-icon-btn"><img src="https://www.apple.com/favicon.ico" alt="Google" class="h-6 w-6"></button>
                    </div>

                    <p id="toggle-auth" class="mt-8 text-center text-sm text-gray-500 dark:text-gray-300">
                        Belum punya akun? <a href="#" class="font-semibold text-[#4a56e2] hover:underline">Gas daftar</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
    `;

  const toggleLink = document.getElementById("toggle-auth");
  const formTitle = document.getElementById("form-title");
  const submitButton = document.getElementById("submit-button");
  const confirmPasswordField = document.getElementById(
    "confirm-password-field"
  );
  const confirmPasswordInput = document.getElementById("confirm-password");
  let isLoginView = true;

  if (toggleLink) {
    toggleLink.addEventListener("click", (e) => {
      e.preventDefault();
      isLoginView = !isLoginView;
      const toggleText = toggleLink.querySelector("a");

      if (isLoginView) {
        if (formTitle) formTitle.textContent = "Log in";
        if (submitButton) submitButton.textContent = "Log in";
        toggleLink.childNodes[0].nodeValue = "Don't have an account? ";
        if (toggleText) toggleText.textContent = "Sign up";
        confirmPasswordField?.classList.add("hidden");
        if (confirmPasswordInput) confirmPasswordInput.required = false;
      } else {
        if (formTitle) formTitle.textContent = "Sign Up";
        if (submitButton) submitButton.textContent = "Sign Up";
        toggleLink.childNodes[0].nodeValue = "Already have an account? ";
        if (toggleText) toggleText.textContent = "Log in";
        confirmPasswordField?.classList.remove("hidden");
        if (confirmPasswordInput) confirmPasswordInput.required = true;
      }
    });
  }

  const authForm = document.getElementById("auth-form");
  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");
      const confirmPasswordInput = document.getElementById("confirm-password");

      const email = emailInput.value;
      const password = passwordInput.value;

      if (isLoginView) {
        if (!email || !password) {
          alert("Email dan password harus diisi!");
          return;
        }
        // For demo, we'll use the email as the username.
        const username = email.split("@")[0];
        auth.login(username);
        renderNavbar();
        alert("Login Berhasil!");
        window.location.hash = "#akun";
      } else {
        const confirmPassword = confirmPasswordInput.value;
        if (!email || !password || !confirmPassword) {
          alert("Semua field harus diisi!");
          return;
        }
        if (password !== confirmPassword) {
          alert("Password dan konfirmasi password tidak cocok!");
          return;
        }
        const username = email.split("@")[0];
        auth.login(username);
        renderNavbar();
        alert("Pendaftaran Berhasil!");
        window.location.hash = "#akun";
      }
    });
  }
}
