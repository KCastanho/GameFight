const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['attack', 'special', 'heal', 'defense'], required: true },
  power: { type: Number, required: true, min: 0 },
  manaCost: { type: Number, required: true, min: 0 }
});

const characterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  avatar: { type: String, default: '🥊' },
  idleGif: { type: String, default: '' },
  attackGif: { type: String, default: '' },
  stats: {
    health: { type: Number, required: true, min: 1 },
    attack: { type: Number, required: true, min: 1 },
    defense: { type: Number, required: true, min: 0 },
    speed: { type: Number, required: true, min: 1 },
    mana: { type: Number, required: true, min: 0 }
  },
  skills: { type: [skillSchema], validate: [arr => arr.length === 4, 'Exactement 4 compétences requises'] },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Character', characterSchema);
