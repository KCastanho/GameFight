const express = require('express');
const Character = require('../models/Character');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const characters = await Character.find().sort({ createdAt: -1 });
    res.json(characters);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/active', async (req, res) => {
  try {
    const characters = await Character.find({ isActive: true }).sort({ name: 1 });
    res.json(characters);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const character = new Character(req.body);
    await character.save();
    res.status(201).json({ message: 'Personnage créé!', character });
  } catch (error) {
    res.status(400).json({ message: 'Erreur de création', error: error.message });
  }
});

router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const character = await Character.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!character) return res.status(404).json({ message: 'Personnage non trouvé' });
    res.json({ message: 'Personnage mis à jour!', character });
  } catch (error) {
    res.status(400).json({ message: 'Erreur de mise à jour', error: error.message });
  }
});

router.patch('/:id/toggle', auth, isAdmin, async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) return res.status(404).json({ message: 'Personnage non trouvé' });
    character.isActive = !character.isActive;
    await character.save();
    res.json({ message: `Personnage ${character.isActive ? 'activé' : 'désactivé'}!`, character });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const character = await Character.findByIdAndDelete(req.params.id);
    if (!character) return res.status(404).json({ message: 'Personnage non trouvé' });
    res.json({ message: 'Personnage supprimé!' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
