const express = require('express');
const admin = require('firebase-admin');
const app = express();
const path = require('path');

const serviceAccount = require('./key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('signup');
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await db.collection('capstone').where('email', '==', email).get();
    if (!existingUser.empty) {
      return res.send("User Already Exists!");
    }
    await db.collection('capstone').add({
      
      email,
      password
    });
    return res.redirect('/signin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error storing user data');
  }
});

app.get('/signin', (req, res) => {
  res.render('signin');
});
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const userRef = db.collection('capstone').where('email', '==', email).where('password', '==', password);
      const present = await userRef.get();
  
      if (present.empty) {
        res.send("Invalid email or password");
        
      } else {
        res.redirect('/dashboard');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error checking user credentials');
    }
  });
  
  
app.get('/dashboard', async(req, res) => {
 

  res.render('dashboard');
});

app.listen(5000, _ => console.log('Server is running on port 5000'));
