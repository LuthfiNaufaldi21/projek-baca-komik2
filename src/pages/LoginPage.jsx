import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLoginView) {
      if (!email || !password) {
        alert("Email dan password harus diisi!");
        return;
      }
      const username = email.split("@")[0];
      login(username);
      alert("Login Berhasil!");
      navigate("/akun");
    } else {
      if (!email || !password || !confirmPassword) {
        alert("Semua field harus diisi!");
        return;
      }
      if (password !== confirmPassword) {
        alert("Password dan konfirmasi password tidak cocok!");
        return;
      }
      const username = email.split("@")[0];
      login(username);
      alert("Pendaftaran Berhasil!");
      navigate("/akun");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex w-full max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden min-h-[600px]">
        {/* Left Side - Image & Branding */}
        <div
          className="hidden md:flex md:w-1/2 bg-cover bg-center relative items-center justify-center p-12"
          style={{ backgroundImage: "url(/login-img.jpg)" }}
        >
          <div className="absolute inset-0 bg-black/40 z-[1]"></div>
          <div className="relative z-[2] text-center text-white">
            <h1 className="text-5xl font-bold mb-6 tracking-wide drop-shadow-lg font-serif">
              KomiKita
            </h1>
            <p className="text-lg font-medium leading-relaxed opacity-90 max-w-md mx-auto">
              Tempat seru membaca komik aduhay, menghadirkan cerita seru, gambar
              no burik burik, update cepat, dan pengalaman membaca yang selalu
              bikin ketagihan
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 bg-white dark:bg-gray-800 transition-colors duration-300">
          <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#4a56e2] mb-2">
                {isLoginView ? "Salam, pecinta komik" : "Gabung Komunitas Kami"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {isLoginView
                  ? "Masuk dengan email"
                  : "Daftar sekarang dan mulai membaca"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Alamat email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a56e2] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a56e2] focus:border-transparent transition-all duration-200"
                  />
                </div>
                {isLoginView && (
                  <div className="flex justify-end mt-1">
                    <a
                      href="#"
                      className="text-xs text-gray-500 hover:text-[#4a56e2] hover:underline"
                    >
                      Lupa passwordmu?
                    </a>
                  </div>
                )}
              </div>

              {!isLoginView && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required={!isLoginView}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a56e2] focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#4a56e2] hover:bg-[#3b47c4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a56e2] transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg uppercase tracking-wide"
              >
                {isLoginView ? "LOGIN" : "SIGN UP"}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-400">
                    Bisa juga dengan
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <button className="w-12 h-12 inline-flex justify-center items-center border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="h-6 w-6"
                  />
                </button>
                <button className="w-12 h-12 inline-flex justify-center items-center border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png"
                    alt="Facebook"
                    className="h-6 w-6"
                  />
                </button>
                <button className="w-12 h-12 inline-flex justify-center items-center border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  <img
                    src="https://www.apple.com/favicon.ico"
                    alt="Apple"
                    className="h-6 w-6"
                  />
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              {isLoginView ? "Belum punya akun? " : "Sudah punya akun? "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLoginView(!isLoginView);
                }}
                className="font-bold text-[#4a56e2] hover:underline transition-colors"
              >
                {isLoginView ? "Daftar disini" : "Login sekarang"}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
