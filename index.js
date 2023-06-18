const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const { title } = require('process');

app.use(bodyParser.json());

let users = [
  {
    id: 1,
    name: "Duc Huynh",
    favoriteMovies: []
  },
  {
    id: 2,
    name: "Thao Nguyen",
    favoriteMovies: []
  },
  {
    id: 3,
    name: "Lucas Huynh",
    favoriteMovies: []
  },
  {
    id: 4,
    name: "Somebody else",
    favoriteMovies: []
  }
];

let movies = [
  {
    "Title":"Black Panther",
    "Description":"T'Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new future and must confront a challenger from his country's past.",
    "Genre": {
      "Name":"Action",
      "Description":""},
    "Director":{
    "Name":"Ryan Coogler",
    "Bio":"Ryan Kyle Coogler is an African-American filmmaker and producer who is from Oakland, California. He is known for directing the Black Panther film series, Creed, a Rocky spin-off and Fruitvale Station. He frequently casts Michael B. Jordan in his works. He produced the Creed sequels, Judas and the Black Messiah and Space Jam: A New Legacy.",
    "Birth": 1986
    },
    "Feature":false
  },
  {
    "Title":"Kung Fu Panda",
    "Description":"To everyone's surprise, including his own, Po, an overweight, clumsy panda, is chosen as protector of the Valley of Peace. His suitability will soon be tested as the valley's arch-enemy is on his way.",
    "Genre": {
      "Name":"Animation",
      "Description":""
    },
    "Director":{
    "Name":"Mark Osbornen",
    "Bio":"Mark Randolph Osborne is an American film director, writer, producer and animator from Trenton, New Jersey who is known for co-directing the Oscar nominated Kung Fu Panda (2008) and The SpongeBob SquarePants Movie (2004).",
    "Birth":1970
    },
    "Feature":false
  },{
    "Title":"Big Hero 6",
    "Description":"A special bond develops between plus-sized inflatable robot Baymax and prodigy Hiro Hamada, who together team up with a group of friends to form a band of high-tech heroes.",
    "Genre": {
      "Name":"Animation",
      "Description":""
    },
    "Director":{
    "Name":"Don Hall",
    "Bio":"Don Hall was born on March 8, 1969 in Glenwood, Iowa, USA. He is a writer and director, known for Big Hero 6 (2014), Meet the Robinsons (2007) and Raya and the Last Dragon (2021).",
    "Birth":1969
    },
    "Feature":false
  },  
];

//READ
app.get('/movies', (req,res) => {
  res.status(200).json(movies);
})

//READ
app.get('/movies/:title', (req,res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.Title === title );

  if(movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('no such movie')
  }
})

//READ
app.get('/movies/genre/:genreName', (req,res) => {
  const { genreName } = req.params;
  const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

  if(genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre')
  }
})

//READ
app.get('/movies/directors/:directorName', (req,res) => {
  const { directorName } = req.params;
  const director = movies.find( movie => movie.Director.Name === directorName ).Director;

  if(director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('no such director')
  }
})
//CREATE
app.post('/users', (req, res) => {
  const newUser = req.body;

  if(newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('user need name')
  }
})

//UPDATE
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updateUser = req.body;

  let user = users.find( user => user.id == id );

  if(user) {
    user.name = updateUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user')
  }
  
})

//CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if(user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).json(user);
  } else {
    res.status(400).send('no such movie')
  }
  
})

//DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if(user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send('no such movie')
  }
  
})

//DELETE
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.id == id );

  if(user) {
    users = users.filter( user => user.id != id);
    res.status(200).send(`user ${id} has been deleted!`);
  } else {
    res.status(400).send('no such user')
  }
  
})


// app.use(morgan('common'));

// app.get('/', (req, res) => {
//   res.send('Welcome to my Movie Page!');
// });

// app.get('/documentation', (req, res) => {                  
//   res.sendFile('public/documentation.html', { root: __dirname });
// });

// app.get('/movies', (req, res) => {
//   res.json(topMovies);
// });

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
//   });

// const accessLogStream = fs.createWriteStream(
//     path.join(__dirname, 'log.txt'), {flags: 'a'});

// app.use(morgan('combined', {stream: accessLogStream}));
  
// app.get('/secreturl', (req, res) => {
//     res.send('This is a secret url with super top-secret content.');
//   });
  
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });