import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { characterService } from '../services/api';
import Navbar from '../components/Navbar';
import '../styles/combat.css';

// ========== TOUTE LA LOGIQUE DE COMBAT EST ICI EN FRONTEND ==========

const CRITICAL_CHANCE = 0.1;

const calculateDamage = (attacker, skill, defender, isCritical) => {
  const baseDamage = skill.power + attacker.stats.attack;
  const defense = defender.stats.defense;
  const damage = Math.max(1, baseDamage - defense);
  return isCritical ? damage * 2 : damage;
};

const calculateHeal = (skill) => {
  return skill.power;
};

const chooseAIAction = (enemy) => {
  const usableSkills = enemy.skills.filter(s => enemy.currentMana >= s.manaCost);
  if (usableSkills.length === 0) return enemy.skills.find(s => s.manaCost === 0) || enemy.skills[0];
  return usableSkills[Math.floor(Math.random() * usableSkills.length)];
};

// ====================================================================

const HPBar = ({ current, max }) => {
  const pct = Math.max(0, (current / max) * 100);
  const color = pct > 50 ? 'pokemon-hp-green' : pct > 25 ? 'pokemon-hp-yellow' : 'pokemon-hp-red';
  return (
    <div className="hp-bar-container">
      <span className="hp-label">HP</span>
      <div className="pokemon-hp-bar" style={{ flex: 1 }}>
        <motion.div className={`pokemon-hp-bar-inner ${color}`} animate={{ width: `${pct}%` }} />
      </div>
      <span className="hp-value">{current}/{max}</span>
    </div>
  );
};

const Combat = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState('selection');
  
  // État du combat (tout en local!)
  const [player, setPlayer] = useState(null);
  const [enemy, setEnemy] = useState(null);
  const [turn, setTurn] = useState(1);
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('ongoing');
  const [isAnimating, setIsAnimating] = useState(false);
  const [playerAnim, setPlayerAnim] = useState('');
  const [enemyAnim, setEnemyAnim] = useState('');

  useEffect(() => {
    characterService.getActive()
      .then(res => setCharacters(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const startCombat = (selectedChar) => {
    const enemies = characters.filter(c => c._id !== selectedChar._id);
    if (enemies.length === 0) {
      alert('Pas d\'ennemi disponible!');
      return;
    }
    const enemyChar = enemies[Math.floor(Math.random() * enemies.length)];
    
    setPlayer({
      ...selectedChar,
      currentHealth: selectedChar.stats.health,
      currentMana: selectedChar.stats.mana,
    });
    setEnemy({
      ...enemyChar,
      currentHealth: enemyChar.stats.health,
      currentMana: enemyChar.stats.mana,
    });
    setTurn(1);
    setLogs([`⚔️ ${selectedChar.name} VS ${enemyChar.name}!`]);
    setMessage(`Un ${enemyChar.name} sauvage apparaît!`);
    setStatus('ongoing');
    setPhase('combat');
  };

  // ========== LOGIQUE DE COMBAT 100% FRONTEND ==========
  const performAction = (skillIndex) => {
    if (isAnimating || status !== 'ongoing') return;
    
    const skill = player.skills[skillIndex];
    if (player.currentMana < skill.manaCost) {
      setMessage('Pas assez de mana!');
      return;
    }

    setIsAnimating(true);
    const newLogs = [...logs];

    // === TOUR DU JOUEUR ===
    const isCritical = Math.random() < CRITICAL_CHANCE;
    let newPlayer = { ...player, currentMana: player.currentMana - skill.manaCost };
    let newEnemy = { ...enemy };

    setMessage(`${player.name} utilise ${skill.name}!`);
    setPlayerAnim('attack');

    setTimeout(() => {
      setPlayerAnim('');
      setEnemyAnim('damage');

      if (skill.type === 'heal') {
        const heal = calculateHeal(skill);
        newPlayer.currentHealth = Math.min(player.stats.health, newPlayer.currentHealth + heal);
        newLogs.push(`${player.name} récupère ${heal} PV!`);
      } else {
        const damage = calculateDamage(player, skill, enemy, isCritical);
        newEnemy.currentHealth = Math.max(0, newEnemy.currentHealth - damage);
        let log = `⚔️ ${player.name} inflige ${damage} dégâts`;
        if (isCritical) log += ' 💥 CRITIQUE!';
        newLogs.push(log);
      }

      setPlayer(newPlayer);
      setEnemy(newEnemy);
      setLogs(newLogs);

      setTimeout(() => {
        setEnemyAnim('');

        // Vérifier victoire
        if (newEnemy.currentHealth <= 0) {
          setStatus('victory');
          setMessage(`${enemy.name} est K.O.! VICTOIRE!`);
          newLogs.push(`🏆 ${player.name} gagne!`);
          setLogs(newLogs);
          setIsAnimating(false);
          return;
        }

        // === TOUR DE L'IA ===
        setTimeout(() => {
          const aiSkill = chooseAIAction(newEnemy);
          if (newEnemy.currentMana >= aiSkill.manaCost) {
            newEnemy = { ...newEnemy, currentMana: newEnemy.currentMana - aiSkill.manaCost };
          }

          setMessage(`${enemy.name} utilise ${aiSkill.name}!`);
          setEnemyAnim('attack');

          setTimeout(() => {
            setEnemyAnim('');
            setPlayerAnim('damage');

            const aiCritical = Math.random() < CRITICAL_CHANCE;
            
            if (aiSkill.type === 'heal') {
              const heal = calculateHeal(aiSkill);
              newEnemy.currentHealth = Math.min(enemy.stats.health, newEnemy.currentHealth + heal);
              newLogs.push(`${enemy.name} récupère ${heal} PV!`);
            } else {
              const damage = calculateDamage(enemy, aiSkill, newPlayer, aiCritical);
              newPlayer = { ...newPlayer, currentHealth: Math.max(0, newPlayer.currentHealth - damage) };
              let log = `⚔️ ${enemy.name} inflige ${damage} dégâts`;
              if (aiCritical) log += ' 💥 CRITIQUE!';
              newLogs.push(log);
            }

            setPlayer(newPlayer);
            setEnemy(newEnemy);
            setLogs(newLogs);

            setTimeout(() => {
              setPlayerAnim('');

              if (newPlayer.currentHealth <= 0) {
                setStatus('defeat');
                setMessage(`${player.name} est K.O.! DÉFAITE...`);
                newLogs.push(`💀 ${enemy.name} gagne...`);
                setLogs(newLogs);
              } else {
                setTurn(t => t + 1);
                setMessage(`Tour ${turn + 1} - Choisissez une action!`);
              }
              setIsAnimating(false);
            }, 400);
          }, 400);
        }, 600);
      }, 400);
    }, 400);
  };
  // =====================================================

  const resetCombat = () => {
    setPhase('selection');
    setPlayer(null);
    setEnemy(null);
    setStatus('ongoing');
    setLogs([]);
  };

  if (loading) {
    return (
      <div className="combat-page">
        <Navbar />
        <div className="combat-loading">
          <div className="pokemon-dialog combat-loading-text">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="combat-page">
      {phase === 'selection' ? (
        <>
          <Navbar />
          <div className="selection-container">
            <div className="pokemon-dialog selection-header">
              <h1 className="selection-title">⚔️ CHOISISSEZ VOTRE COMBATTANT</h1>
              <p className="selection-subtitle">✨ Combat en Frontend - Instantané!</p>
            </div>
            {characters.length < 2 ? (
              <div className="pokemon-dialog no-characters">
                <p className="no-characters-text">Il faut au moins 2 personnages!</p>
                <Link to="/" className="pokemon-btn back-btn">Retour</Link>
              </div>
            ) : (
              <div className="character-grid">
                {characters.map(c => (
                  <motion.div
                    key={c._id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => startCombat(c)}
                    className="pokemon-card character-select-card"
                  >
                    <div className="pokemon-card-header character-card-name">{c.name}</div>
                    <div className="character-card-body">
                      <div className="character-avatar">
                        <img src={`/src/images/${c.avatar}`} alt={c.name} className="character-avatar-img" />
                      </div>
                      <div className="stats-grid">
                        <div className="stat-hp">HP {c.stats.health}</div>
                        <div className="stat-mp">MP {c.stats.mana}</div>
                        <div className="stat-atk">ATK {c.stats.attack}</div>
                        <div className="stat-spd">SPD {c.stats.speed}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="combat-container">
          {/* Arena */}
          <div className="pokemon-arena arena">
            {/* Enemy */}
            <div className="pokemon-dialog enemy-stats-box">
              <div className="enemy-header">
                <span>{enemy?.name}</span>
                <span>Nv.50</span>
              </div>
              <HPBar current={enemy?.currentHealth || 0} max={enemy?.stats.health || 1} />
            </div>
            <motion.div 
              className="enemy-avatar"
              animate={enemyAnim === 'attack' && !enemy?.attackGif ? { x: [0, -20, 0] } : enemyAnim === 'damage' ? { opacity: [1, 0.2, 1, 0.2, 1] } : {}}
            >
              <img 
                src={enemyAnim === 'attack' && enemy?.attackGif
                  ? `/src/images/${enemy?.attackGif}` 
                  : enemy?.idleGif
                  ? `/src/images/${enemy?.idleGif}`
                  : `/src/images/${enemy?.avatar}`
                } 
                alt={enemy?.name}
                className="character-gif"
              />
            </motion.div>

            {/* Player */}
            <div className="pokemon-dialog player-stats-box">
              <div className="player-header">
                <span>{player?.name}</span>
                <span>Nv.50</span>
              </div>
              <HPBar current={player?.currentHealth || 0} max={player?.stats.health || 1} />
              <div className="mp-bar-container">
                <span className="mp-label">MP</span>
                <div className="mp-bar">
                  <div className="mp-bar-inner" style={{ width: `${((player?.currentMana || 0) / (player?.stats.mana || 1)) * 100}%` }} />
                </div>
                <span className="mp-value">{player?.currentMana}/{player?.stats.mana}</span>
              </div>
            </div>
            <motion.div 
              className="player-avatar"
              animate={playerAnim === 'attack' && !player?.attackGif ? { x: [0, 20, 0] } : playerAnim === 'damage' ? { opacity: [1, 0.2, 1, 0.2, 1] } : {}}
            >
              <img 
                src={playerAnim === 'attack' && player?.attackGif
                  ? `/src/images/${player?.attackGif}` 
                  : player?.idleGif
                  ? `/src/images/${player?.idleGif}`
                  : `/src/images/${player?.avatar}`
                } 
                alt={player?.name}
                className="character-gif"
              />
            </motion.div>
          </div>

          {/* UI */}
          <div className="combat-ui">
            {status !== 'ongoing' ? (
              <>
                <div className="result-container">
                  <div className="pokemon-dialog result-message-box">
                    <p className={`result-message ${status === 'victory' ? 'result-victory' : 'result-defeat'}`}>{message}</p>
                  </div>
                  <div className="result-buttons">
                    <button onClick={resetCombat} className="pokemon-btn pokemon-btn-selected">🔄 REJOUER</button>
                    <Link to="/" className="pokemon-btn">🏠 ACCUEIL</Link>
                  </div>
                </div>
                {/* Combat Logs */}
                <div className="pokemon-dialog combat-logs">
                  <div className="combat-logs-header">📜 HISTORIQUE</div>
                  <div className="combat-logs-content">
                    {logs.map((log, i) => (
                      <div key={i} className="combat-log-entry">{log}</div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="action-grid">
                  <div className="message-box">
                    <div className="pokemon-dialog message-inner">
                      <p className="message-text">{message || `Que doit faire ${player?.name}?`}</p>
                    </div>
                  </div>
                  <div className="skills-grid">
                    {player?.skills.map((skill, i) => (
                      <button
                        key={i}
                        onClick={() => performAction(i)}
                        disabled={isAnimating || player.currentMana < skill.manaCost}
                        className={`pokemon-btn skill-btn ${player.currentMana < skill.manaCost ? 'skill-btn-disabled' : ''}`}
                      >
                        <div className="skill-header">
                          <div className="skill-name">{skill.name}</div>
                          <span className={`skill-type skill-type-${skill.type}`}>
                            {skill.type === 'attack' ? 'ATK' : skill.type === 'special' ? 'SPE' : skill.type === 'heal' ? 'HEAL' : 'DEF'}
                          </span>
                        </div>
                        <div className="skill-info">PWR:{skill.power} MP:{skill.manaCost}</div>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Combat Logs */}
                <div className="pokemon-dialog combat-logs">
                  <div className="combat-logs-header">📜 HISTORIQUE</div>
                  <div className="combat-logs-content">
                    {logs.map((log, i) => (
                      <div key={i} className="combat-log-entry">{log}</div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Combat;
