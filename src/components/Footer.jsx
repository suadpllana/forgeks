import { Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <Gamepad2 size={24} />
            <span>Forge Ks</span>
          </Link>
          <p>Your one-stop shop for PC, PS5 &amp; PS4 digital games. Instant key delivery to your inbox.</p>
        </div>
        <div className="footer-links-group">
          <h4>Shop</h4>
          <Link to="/games">All Games</Link>
          <Link to="/gift-cards">Gift Cards</Link>
          <Link to="/games?sale=true">On Sale</Link>
        </div>
        <div className="footer-links-group">
          <h4>Account</h4>
          <Link to="/orders">My Orders</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Cart</Link>
        </div>
        <div className="footer-links-group">
          <h4>Support</h4>
          <a href="#!">Help Center</a>
          <a href="#!">Contact Us</a>
          <a href="#!">Refund Policy</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Forge Ks. All rights reserved.</p>
      </div>
    </footer>
  );
}
