import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { characterService } from '../services/api';
import Navbar from '../components/Navbar';
import '../styles/admin.css';

// Liste des PNG disponibles pour les avatars dans /src/images/
const AVAILABLE_AVATARS = [
  'samurai_avatar.png',
  'squid_avatar.png',
  'cyclop_avatar.png',
  'giantbamboo_avatar.png',
  'fire_avatar.png',
  'froggy_avatar.png',
  'giantracoon_avatar.png',
  'slime_avatar.png',
  'spirit_avatar.png',
  'tengu_avatar.png',
  // Ajoute tes autres PNG d'avatar ici
];

// Liste des GIFs disponibles dans /src/images/
// Ajoute ici les noms de tes fichiers GIF
const AVAILABLE_GIFS = [
  '',  // Option vide pour ne pas utiliser de GIF
  'samurai_idle.gif',
  'samurai_attack.gif',
  'squid_idle.gif',
  'squid_attack.gif',
  'cyclop_idle.gif',
  'cyclop_attack.gif',
  'giantbamboo_idle.gif',
  'giantbamboo_attack.gif',
  'fire_idle.gif',
  'fire_attack.gif',
  'froggy_idle.gif',
  'froggy_attack.gif',
  'giantracoon_idle.gif',
  'giantracoon_attack.gif',
  'slime_idle.gif',
  'slime_attack.gif',
  'spirit_idle.gif',
  'spirit_attack.gif',
  'tengu_idle.gif',
  'tengu_attack.gif',
  // Ajoute tes autres GIFs ici
];

const Admin = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', avatar: AVAILABLE_AVATARS[0], idleGif: '', attackGif: '',
    stats: { health: 100, attack: 10, defense: 5, speed: 10, mana: 100 },
    skills: [
      { name: 'Attaque', type: 'attack', power: 15, manaCost: 0 },
      { name: 'Spéciale', type: 'special', power: 30, manaCost: 25 },
      { name: 'Soin', type: 'heal', power: 20, manaCost: 20 },
      { name: 'Défense', type: 'defense', power: 15, manaCost: 10 },
    ]
  });

  const fetchCharacters = () => {
    characterService.getAll()
      .then(res => setCharacters(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCharacters(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await characterService.update(editing._id, form);
      } else {
        await characterService.create(form);
      }
      setShowForm(false);
      setEditing(null);
      fetchCharacters();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  const handleEdit = (char) => {
    setForm(char);
    setEditing(char);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer?')) return;
    await characterService.delete(id);
    fetchCharacters();
  };

  const handleToggle = async (id) => {
    await characterService.toggle(id);
    fetchCharacters();
  };

  const resetForm = () => {
    setForm({
      name: '', avatar: AVAILABLE_AVATARS[0], idleGif: '', attackGif: '',
      stats: { health: 100, attack: 10, defense: 5, speed: 10, mana: 100 },
      skills: [
        { name: 'Attaque', type: 'attack', power: 15, manaCost: 0 },
        { name: 'Spéciale', type: 'special', power: 30, manaCost: 25 },
        { name: 'Soin', type: 'heal', power: 20, manaCost: 20 },
        { name: 'Défense', type: 'defense', power: 15, manaCost: 10 },
      ]
    });
    setEditing(null);
    setShowForm(true);
  };

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-container">
        <div className="pokemon-dialog admin-header">
          <div>
            <h1 className="admin-title">🛡️ ADMIN</h1>
            <p className="admin-count">{characters.length} personnages</p>
          </div>
          <button onClick={resetForm} className="pokemon-btn pokemon-btn-selected admin-new-btn">+ NOUVEAU</button>
        </div>

        {loading ? (
          <div className="pokemon-dialog admin-loading">Chargement...</div>
        ) : (
          <div className="admin-grid">
            {characters.map(c => (
              <div key={c._id} className={`pokemon-card ${!c.isActive ? 'admin-card-inactive' : ''}`}>
                <div className={`pokemon-card-header admin-card-header ${!c.isActive ? 'admin-card-header-inactive' : ''}`}>
                  <span>{c.name}</span>
                  <span className={`admin-card-status ${c.isActive ? 'admin-card-status-on' : 'admin-card-status-off'}`}>
                    {c.isActive ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="admin-card-body">
                  <div className="admin-card-avatar">
                    <img src={`/src/images/${c.avatar}`} alt={c.name} className="admin-avatar-img" />
                  </div>
                  <div className="admin-card-stats">
                    <div className="admin-stat admin-stat-hp">HP {c.stats.health}</div>
                    <div className="admin-stat admin-stat-atk">ATK {c.stats.attack}</div>
                    <div className="admin-stat admin-stat-spd">SPD {c.stats.speed}</div>
                  </div>
                  <div className="admin-card-actions">
                    <button onClick={() => handleToggle(c._id)} className="pokemon-btn admin-action-btn admin-action-btn-toggle">
                      {c.isActive ? '⏸' : '▶'}
                    </button>
                    <button onClick={() => handleEdit(c)} className="pokemon-btn admin-action-btn">✏️</button>
                    <button onClick={() => handleDelete(c._id)} className="pokemon-btn admin-action-btn admin-action-btn-delete">🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="admin-modal-overlay"
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="pokemon-dialog admin-modal">
              <div className="admin-modal-header">
                <h2 className="admin-modal-title">{editing ? '✏️ MODIFIER' : '✨ NOUVEAU'}</h2>
                <button onClick={() => setShowForm(false)} className="pokemon-btn admin-modal-close">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="admin-form">
                <div>
                  <label className="admin-form-label">NOM</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="pokemon-input" required />
                </div>
                <div>
                  <label className="admin-form-label">AVATAR (PNG)</label>
                  <select value={form.avatar} onChange={e => setForm({...form, avatar: e.target.value})} 
                    className="pokemon-input">
                    {AVAILABLE_AVATARS.map(avatar => (
                      <option key={avatar} value={avatar}>{avatar}</option>
                    ))}
                  </select>
                  {form.avatar && (
                    <img src={`/src/images/${form.avatar}`} alt="Avatar preview" className="admin-gif-preview" />
                  )}
                </div>
                <div>
                  <label className="admin-form-label">GIF IDLE</label>
                  <select value={form.idleGif} onChange={e => setForm({...form, idleGif: e.target.value})} 
                    className="pokemon-input">
                    {AVAILABLE_GIFS.map(gif => (
                      <option key={gif} value={gif}>{gif || '(Aucun)'}</option>
                    ))}
                  </select>
                  {form.idleGif && (
                    <img src={`/src/images/${form.idleGif}`} alt="Idle preview" className="admin-gif-preview" />
                  )}
                </div>
                <div>
                  <label className="admin-form-label">GIF ATTACK</label>
                  <select value={form.attackGif} onChange={e => setForm({...form, attackGif: e.target.value})} 
                    className="pokemon-input">
                    {AVAILABLE_GIFS.map(gif => (
                      <option key={gif} value={gif}>{gif || '(Aucun)'}</option>
                    ))}
                  </select>
                  {form.attackGif && (
                    <img src={`/src/images/${form.attackGif}`} alt="Attack preview" className="admin-gif-preview" />
                  )}
                </div>
                <div>
                  <label className="admin-form-label">STATS</label>
                  <div className="admin-stats-grid">
                    {['health', 'mana', 'attack', 'defense', 'speed'].map(s => (
                      <div key={s} className="admin-stat-field">
                        <label className="admin-stat-label">{s.toUpperCase().slice(0,3)}</label>
                        <input type="number" value={form.stats[s]} onChange={e => setForm({...form, stats: {...form.stats, [s]: +e.target.value}})}
                          className="pokemon-input admin-stat-input" min="1" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="admin-form-label">COMPÉTENCES (4)</label>
                  <div className="admin-skills-grid">
                    {form.skills.map((skill, i) => (
                      <div key={i} className="pokemon-box admin-skill-box">
                        <input value={skill.name} onChange={e => {
                          const skills = [...form.skills];
                          skills[i] = {...skills[i], name: e.target.value};
                          setForm({...form, skills});
                        }} className="pokemon-input admin-skill-input" placeholder="Nom" />
                        <div className="admin-skill-row">
                          <select value={skill.type} onChange={e => {
                            const skills = [...form.skills];
                            skills[i] = {...skills[i], type: e.target.value};
                            setForm({...form, skills});
                          }} className="pokemon-input admin-skill-select">
                            <option value="attack">ATK</option>
                            <option value="special">SPE</option>
                            <option value="heal">HEAL</option>
                            <option value="defense">DEF</option>
                          </select>
                          <input type="number" value={skill.power} onChange={e => {
                            const skills = [...form.skills];
                            skills[i] = {...skills[i], power: +e.target.value};
                            setForm({...form, skills});
                          }} className="pokemon-input admin-skill-number" placeholder="PWR" min="0" />
                          <input type="number" value={skill.manaCost} onChange={e => {
                            const skills = [...form.skills];
                            skills[i] = {...skills[i], manaCost: +e.target.value};
                            setForm({...form, skills});
                          }} className="pokemon-input admin-skill-number" placeholder="MP" min="0" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="admin-form-actions">
                  <button type="button" onClick={() => setShowForm(false)} className="pokemon-btn admin-form-btn">ANNULER</button>
                  <button type="submit" className="pokemon-btn pokemon-btn-selected admin-form-btn">✓ SAUVER</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
