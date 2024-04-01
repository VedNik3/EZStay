const express = require('express');
const router = express.Router();
const User = require('../models/user');


// signup handler

router.get('/signup', (req, res) => {
  res.sendFile('signup.html', { root: global.staticpath });
});

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).send('Username already exists. Please choose a different username.');
      }

      // Create a new user
      const user = new User({ username, password });
      await user.save();
      res.redirect('/login');
  } catch (err) {
      console.error(err);
      res.status(500).send(`Error signing up: ${err.message}`);
  }
});


  // login handler

router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: global.staticpath });
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) {
      res.status(401).send('Invalid username or password');
    } else {
      req.session.user = user;
      
      res.redirect('/index.html?username=' + encodeURIComponent(username));
     
    }
  } catch (err) {
    console.error(err);
    
    res.status(500).send(`Error loging in: ${err.message}`);
  }
});


//index
router.get('/index.html', (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    res.render('index.html', { username: req.session.user.username });
  }
});




// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      res.status(500).send('Error logging out');
    } else {
      res.redirect('/index.html');
    }
  });
});




module.exports = router;