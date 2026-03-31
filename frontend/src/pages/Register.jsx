import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="pokemon-dialog register-container">
        <div className="register-header">
          <div className="register-icon">⚔️</div>
          <h1 className="register-title">INSCRIPTION</h1>
        </div>
        {error && <div className="register-error">{error}</div>}
        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-field">
            <label className="register-label">PSEUDO</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="pokemon-input" required minLength={3} />
          </div>
          <div className="register-field">
            <label className="register-label">EMAIL</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pokemon-input" required />
          </div>
          <div className="register-field">
            <label className="register-label">MOT DE PASSE</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pokemon-input" required minLength={6} />
          </div>
          <button type="submit" disabled={loading} className="pokemon-btn pokemon-btn-selected pokemon-btn-full">
            {loading ? 'CHARGEMENT...' : '▶ CRÉER'}
          </button>
        </form>
        <p className="register-footer">
          Déjà un compte? <Link to="/login">Connexion</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
