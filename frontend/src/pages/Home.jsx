import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { characterService } from '../services/api';
import Navbar from '../components/Navbar';
import '../styles/home.css';

const Home = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    characterService.getActive()
      .then(res => setCharacters(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      <Navbar />
      <div className="home-container">
        <div className="pokemon-dialog home-hero">
          <img src="/src/images/logo_gamefight.png" alt="Game Fight" className="home-hero-logo" />
          <h1 className="home-hero-title">GAME FIGHT</h1>
          <p className="home-hero-subtitle">Combat au tour par tour - Choisis un personnage et utilise tes compétences pour vaincre l'ennemi - Gère ton mana et tes HP!</p>
          <Link to="/combat" className="pokemon-btn pokemon-btn-selected">▶ JOUER</Link>
        </div>

        <div className="pokemon-dialog home-characters">
          <h2 className="home-characters-title">📋 COMBATTANTS ({characters.length})</h2>
          {loading ? (
            <p className="home-loading">Chargement...</p>
          ) : characters.length === 0 ? (
            <p className="home-empty">Aucun personnage. L'admin doit en créer.</p>
          ) : (
            <div className="home-grid">
              {characters.map(c => (
                <div key={c._id} className="pokemon-card">
                  <div className="pokemon-card-header home-card-name">{c.name}</div>
                  <div className="home-card-body">
                    <div className="home-card-avatar">
                      <img src={`/src/images/${c.avatar}`} alt={c.name} className="home-avatar-img" />
                    </div>
                    <div className="home-stats-grid">
                      <div className="home-stat-hp">HP {c.stats.health}</div>
                      <div className="home-stat-atk">ATK {c.stats.attack}</div>
                      <div className="home-stat-spd">SPD {c.stats.speed}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
