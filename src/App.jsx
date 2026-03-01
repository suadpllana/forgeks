import { HashRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import Home from "./pages/Home";
import AllGames from "./pages/AllGames";
import GameDetail from "./pages/GameDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import GiftCards from "./pages/GiftCards";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import "./App.css";

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          {/* Admin routes — no navbar/footer */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Store routes */}
          <Route
            path="*"
            element={
              <div className="app">
                <Navbar />
                <main className="main">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/games" element={<AllGames />} />
                    <Route path="/games/:slug" element={<GameDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/gift-cards" element={<GiftCards />} />
                  </Routes>
                </main>
                <Footer />
                <AuthModal />
              </div>
            }
          />
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
}
