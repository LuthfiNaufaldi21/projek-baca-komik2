import { BrowserRouter as Router } from "react-router-dom";
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

  return (
    <div className="app__wrapper">
      <Navbar />

      <main className="app__main">
        <AppRouter />
      </main>

      <Footer />
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
