// Import necessary packages
const express = require('express');
const ejs = require('ejs');
const path = require('path');

const firebase = require('./firebase');
const { collection, getFirestore, doc, getDoc, addDoc } = require('firebase/firestore');
const querystring = require('querystring');


// Initialize Express app
const app = express();

// Initialize Firebase
const db = getFirestore(firebase);

// Manually parse URL encoded body because Vercel was throwing up doing it itself
const parseURLEncodedBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(querystring.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
};

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views')); // Set the views directory

// Routes
app.post('/article', async (req, res) => {

  try {
    const body = await parseURLEncodedBody(req);
    const docRef = await addDoc(collection(db, 'Articles'), {
      title: body.title,
      description: body.description,
      image: body.image,
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

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
