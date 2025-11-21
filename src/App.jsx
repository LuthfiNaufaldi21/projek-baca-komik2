import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import DaftarKomikPage from "./pages/DaftarKomikPage";
import BerwarnaPage from "./pages/BerwarnaPage";
import MangaPage from "./pages/MangaPage";
import ManhwaPage from "./pages/ManhwaPage";
import ManhuaPage from "./pages/ManhuaPage";
import GenrePage from "./pages/GenrePage";
import BookmarkPage from "./pages/BookmarkPage";
import SearchPage from "./pages/SearchPage";
import DetailPage from "./pages/DetailPage";
import BackToTop from "./components/BackToTop";

function AppContent() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-6xl mx-auto p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-700/50 my-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/daftar-komik" element={<DaftarKomikPage />} />
          <Route path="/berwarna" element={<BerwarnaPage />} />
          <Route path="/manga" element={<MangaPage />} />
          <Route path="/manhwa" element={<ManhwaPage />} />
          <Route path="/manhua" element={<ManhuaPage />} />
          <Route path="/bookmark" element={<BookmarkPage />} />
          <Route path="/akun" element={<AccountPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/genre/:tag" element={<GenrePage />} />
        </Routes>
      </main>
      <BackToTop />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
