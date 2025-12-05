import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./components/ToastProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import AppRouter from "./routes/router";
import useScrollToTop from "./hooks/useScrollToTop";
import "./App.css";

function AppContent() {
  useScrollToTop();
  const location = useLocation();
  const isReaderPage = location.pathname.startsWith("/read/");

  return (
    <div className="app__wrapper">
      <Navbar />

      <main className={isReaderPage ? "w-full" : "app__main"}>
        <AppRouter />
      </main>

      {!isReaderPage && <Footer />}
      <BackToTop />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
