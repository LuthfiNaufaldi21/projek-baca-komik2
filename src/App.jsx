import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import BackToTop from "./components/BackToTop";
import AppRouter from "./routes/router";
import useScrollToTop from "./hooks/useScrollToTop";
import "./App.css";

function AppContent() {
  useScrollToTop(); // Auto scroll to top on route change

  return (
    <div className="app__wrapper">
      <Navbar />
      <main className="app__main">
        <AppRouter />
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
