import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import AppRouter from "./routes/router";
import useScrollToTop from "./hooks/useScrollToTop";
import "./App.css";

function AppContent() {
  useScrollToTop();

  return (
    <div className="app__wrapper flex flex-col min-h-screen">
      <Navbar />
      <main className="app__main flex-grow">
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