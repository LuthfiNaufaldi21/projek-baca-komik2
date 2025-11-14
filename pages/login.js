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
            <div class="login-form-panel">
                <div class="w-full max-w-md">
                    <div class="text-center">
                        <h2 class="text-4xl font-bold text-[#4a56e2]">Salam, pecinta komik</h2>
                        <p class="text-gray-500 mt-2">Masuk dengan email</p>
                    </div>
                    <form id="auth-form" class="mt-8 space-y-6">
                        <div class="relative">
                            <label for="email" class="block text-xs font-medium text-gray-500">Alamat email </label>
                            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pt-4">
                                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                            </span>
                            <input type="email" id="email" required class="pl-10 mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900">
                        </div>
                        <div class="relative">
                            <div class="flex justify-between items-center">
                                <label for="password" class="block text-xs font-medium text-gray-500">Password</label>
                            </div>
                             <span class="absolute inset-y-0 left-0 flex items-center pl-3 pt-4">
                                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" /></svg>
                            </span>
                            <input type="password" id="password" required class="pl-10 mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900">
                            <a href="#" class="text-xs text-gray-500 hover:underline absolute right-0 -bottom-5">Lupa passwordmu?</a>
                        </div>
                        <div id="confirm-password-field" class="hidden relative">
                            <label class="block text-xs font-medium text-gray-500">Konfirmasi Password mu</label>
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
                        <button class="social-icon-btn"><svg class="h-6 w-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg></button>
                        <button class="social-icon-btn"><svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.178c-1.615 0-3.13.648-4.242 1.822-2.344 2.4-2.282 6.22.146 8.566 1.16 1.116 2.643 1.738 4.096 1.738 1.496 0 2.992-.64 4.168-1.782 2.31-2.284 2.37-6.11.134-8.512C15.13.648 13.615 0 12 0zm0 2.178zm-2.08 15.328c-.513 0-.992.2-1.35.558-.36.358-.56.83-.56 1.322 0 .513.2.992.56 1.35.358.36.837.56 1.35.56.514 0 .993-.2 1.35-.56.36-.358.56-.837.56-1.35 0-.493-.2-.964-.56-1.322-.357-.36-.836-.558-1.35-.558zm3.56-10.552c.8-1.02 2.2-1.89 3.8-1.92.1-.002.2.02.3.04-.1.02-.2.04-.3.04-1.5.03-2.8.85-3.6 1.8-.82 1.012-1.29 2.4-1.1 3.8.2 1.5.9 2.8 1.9 3.6.9.8 2.2 1.2 3.5 1.2.1 0 .2 0 .3-.02-.1 0-.2-.02-.3-.02-1.4 0-2.7-.5-3.6-1.5-.9-1-1.4-2.3-1.2-3.6.1-1.3.7-2.5 1.6-3.4z"/></svg></button>
                    </div>

                    <p id="toggle-auth" class="mt-8 text-center text-sm text-gray-500">
                        Belum punya akun? <a href="#" class="font-semibold text-gray-700 hover:underline">Gas daftar</a>
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
