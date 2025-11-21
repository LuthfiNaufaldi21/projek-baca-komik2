import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function AccountPage() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    alert("Anda telah logout.");
    navigate("/");
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Akun Saya
      </h2>
      <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
        Selamat datang,{" "}
        <strong className="text-primary">{user?.username || "Pengguna"}</strong>
        !
      </p>

      <div className="mb-6">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Bookmark
          </p>
          <p className="text-2xl font-bold text-primary">
            {user?.bookmarks?.length || 0}
          </p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
      >
        Logout
      </button>
    </div>
  );
}
