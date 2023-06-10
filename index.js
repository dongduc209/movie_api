const express = require('express'),
    morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();

let topMovies = [
  {
    title: 'Black Panther: Wakanda Forever',
    director: 'Ryan Coogler'
  },
  {
    title: 'Lord of the Rings',
    director: 'J.R.R. Tolkien'
  },
  {
    title: 'Twilight',
    director: 'Stephanie Meyer'
  },
  {
    title: 'Lord of the Rings',
    director: 'J.R.R. Tolkien'
  },
  {
    title: 'Guardians of the Galaxy',
    director: 'James Gunn'
  },
  {
    title: 'Spider-Man: Homecoming',
    director: 'Jon Watts'
  },
  {
    title: 'The Avengers',
    director: 'Joss Whedon'
  },
  {
    title: 'Captain America: Civil War',
    director: 'Anthony Russo, Joe Russo'
  },
  {
    title: 'Black Panther',
    director: 'Ryan Coogler'
  },
  {
    title: 'Doctor Strange in the Multiverse of Madness',
    director: 'Sam Raimi'
  }
];

app.use(morgan('common'));

app.get('/', (req, res) => {
  res.send('Welcome to my Movie Page!');
});

app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'log.txt'), {flags: 'a'});

app.use(morgan('combined', {stream: accessLogStream}));
  
app.get('/secreturl', (req, res) => {
    res.send('This is a secret url with super top-secret content.');
  });
  
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });