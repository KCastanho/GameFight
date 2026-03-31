import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="pokemon-dialog navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src="/src/images/logo_gamefight.png" alt="Game Fight" className="navbar-logo" />
          <span className="navbar-brand-text">GAME FIGHT</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">🏠 ACCUEIL</Link>
          <Link to="/combat" className="navbar-link">⚔️ COMBAT</Link>
          {isAdmin() && <Link to="/admin" className="navbar-link navbar-link-admin">🛡️ ADMIN</Link>}
          <span className="navbar-username">{user?.username}</span>
          <button onClick={handleLogout} className="navbar-logout">🚪</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
