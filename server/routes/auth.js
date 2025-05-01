const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

// Login com Discord
router.get('/discord', passport.authenticate('discord'));

// Callback do Discord
router.get('/discord/callback', passport.authenticate('discord', {
  failureRedirect: '/login',
  successRedirect: '/'
}));

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Obter usuário atual
router.get('/current', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Não autenticado' });
  
  try {
    const user = await User.findOne({ discordId: req.user.id });
    if (!user) {
      // Criar novo usuário se não existir
      const newUser = new User({
        discordId: req.user.id,
        username: req.user.username,
        avatar: req.user.avatar
          ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`
          : null
      });
      await newUser.save();
      return res.json(newUser);
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;