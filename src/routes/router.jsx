import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import AccountPage from "../pages/AccountPage";
import DaftarKomikPage from "../pages/DaftarKomikPage";
import BerwarnaPage from "../pages/BerwarnaPage";
import MangaPage from "../pages/MangaPage";
import ManhwaPage from "../pages/ManhwaPage";
import ManhuaPage from "../pages/ManhuaPage";
import GenrePage from "../pages/GenrePage";
import BookmarkPage from "../pages/BookmarkPage";
import SearchPage from "../pages/SearchPage";
import DetailPage from "../pages/DetailPage";
import ReaderPage from "../pages/ReaderPage";
import RiwayatPage from "../pages/RiwayatPage";

export default function AppRouter() {
  return (
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
      <Route path="/riwayat" element={<RiwayatPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/detail/:id" element={<DetailPage />} />
      <Route path="/genre/:tag" element={<GenrePage />} />
      <Route path="/read/:comicId/:chapterId" element={<ReaderPage />} />
    </Routes>
  );
}
