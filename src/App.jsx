import { HashRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import AllGames from "./pages/AllGames";
import GameDetail from "./pages/GameDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import GiftCards from "./pages/GiftCards";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import RefundPolicy from "./pages/legal/RefundPolicy";
import HelpCenter from "./pages/legal/HelpCenter";
import ContactUs from "./pages/legal/ContactUs";
import TermsOfService from "./pages/legal/TermsOfService";
import "./lib/i18n";
import "./App.css";

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <ScrollToTop />
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
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/help" element={<HelpCenter />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="*" element={<NotFound />} />
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
