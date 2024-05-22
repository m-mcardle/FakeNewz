// Import necessary packages
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const firebase = require('./firebase');
const { collection, getFirestore, doc, getDoc, addDoc } = require('firebase/firestore');


// Initialize Express app
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Initialize Firebase
const db = getFirestore(firebase);

// Set view engine
app.set('view engine', 'ejs');

// Routes
app.post('/article', async (req, res) => {

  try {
    const docRef = await addDoc(collection(db, 'Articles'), {
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
    });

    console.log('Document written with ID: ', docRef.id);

    // Generate URL
    var url = req.protocol + '://' + req.get('host') + '/article/' + docRef.id;

    console.log(url);

    // Send URL
    res.send(url);
  } catch (e) {
    console.error('Error adding document: ', e);
    res.send('Error');
  }
});

app.get('/create', (req, res) => {
  res.render('create_article');
});

app.get('/article/:id', async (req, res) => {
  // Get article from Firebase
  var articleRef = doc(db, 'Articles', req.params.id);
  var articleDoc = await getDoc(articleRef);
  var article = articleDoc.data();

  if (!article) {
    res.render('not_found');
    return;
  }
  // Render view with OG tags
  res.render('article', { article: article });
});

// images route
app.get('/images/:image', (req, res) => {
  res.sendFile(__dirname + '/images/' + req.params.image);
});

// Start server
app.listen(3000, () => console.log('Server started on port 3000'));
