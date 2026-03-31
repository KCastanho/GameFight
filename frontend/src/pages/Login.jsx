import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="pokemon-dialog login-container">
        <div className="login-header">
          <div className="login-icon">🥊</div>
          <h1 className="login-title">GAME FIGHT V2</h1>
          <p className="login-subtitle">Combat en Frontend!</p>
        </div>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label">EMAIL</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pokemon-input" required />
          </div>
          <div className="login-field">
            <label className="login-label">MOT DE PASSE</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pokemon-input" required />
          </div>
          <button type="submit" disabled={loading} className="pokemon-btn pokemon-btn-selected pokemon-btn-full">
            {loading ? 'CHARGEMENT...' : '▶ CONNEXION'}
          </button>
        </form>
        <p className="login-footer">
          Pas de compte? <Link to="/register">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
