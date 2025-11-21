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
    <div className="bg-transparent">
      <div className="flex w-full h-[500px] bg-white overflow-hidden rounded-xl shadow-xl">
        <div
          className="flex-1 bg-cover bg-center relative flex items-center justify-center"
          style={{ backgroundImage: "url(/login-img.jpg)" }}
        >
          <div className="absolute inset-0 bg-black/30 z-[1]"></div>
          <div className="relative z-[2] text-center p-8">
            <h1
              className="text-4xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              KomiKita
            </h1>
            <p className="text-white mt-4 max-w-sm text-center">
              Tempat seru membaca komik aduhay, menghadirkan cerita seru, gambar
              no burik burik, update cepat, dan pengalaman membaca yang selalu
              bikin ketagihan
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 dark:bg-gray-800">
          <div className="w-full max-w-md">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-[#4a56e2]">
                Salam, pecinta komik
              </h2>
              <p className="text-gray-500 mt-2 dark:text-gray-300">
                Masuk dengan email
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-gray-500 dark:text-gray-300"
                >
                  Alamat email
                </label>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pt-4">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                />
              </div>

              <div className="relative">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-gray-500 dark:text-gray-300"
                  >
                    Password
                  </label>
                </div>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pt-4">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                />
                <a
                  href="#"
                  className="text-xs text-gray-500 hover:underline absolute right-0 -bottom-5 dark:text-gray-300"
                >
                  Lupa passwordmu?
                </a>
              </div>

              {!isLoginView && (
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-300">
                    Konfirmasi Password mu
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={!isLoginView}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#4a56e2] text-white font-semibold rounded-md hover:bg-blue-600 transition-all duration-200 transform hover:shadow-lg"
              >
                {isLoginView ? "LOGIN" : "SIGN UP"}
              </button>
            </form>

            <div className="flex items-center text-center text-gray-400 my-8 before:content-[''] before:flex-1 before:border-b before:border-gray-200 before:mr-2 after:content-[''] after:flex-1 after:border-b after:border-gray-200 after:ml-2">
              <span>Bisa juga dengan</span>
            </div>

            <div className="flex justify-center space-x-4">
              <button className="inline-flex items-center justify-center w-[52px] h-[52px] border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200">
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="h-6 w-6"
                />
              </button>
              <button className="inline-flex items-center justify-center w-[52px] h-[52px] border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200">
                <img
                  src="https://www.facebook.com/favicon.ico"
                  alt="Facebook"
                  className="h-6 w-6"
                />
              </button>
              <button className="inline-flex items-center justify-center w-[52px] h-[52px] border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200">
                <img
                  src="https://www.apple.com/favicon.ico"
                  alt="Apple"
                  className="h-6 w-6"
                />
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-300">
              {isLoginView ? "Belum punya akun? " : "Sudah punya akun? "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLoginView(!isLoginView);
                }}
                className="font-semibold text-[#4a56e2] hover:underline"
              >
                {isLoginView ? "Gas daftar" : "Login"}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
