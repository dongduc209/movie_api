const express = require('express'),
      bodyParser = require('body-parser'),
      uuid = require('uuid');

const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const models = require('./models.js');

const movies = models.Movie;
const users = models.User;

mongoose.connect('mongodb://127.0.0.1:27017/new_database', { useNewUrlParser: true, useUnifiedTopology: true });

const fs = require('fs');
const path = require('path');
const { title } = require('process');

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

//Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
  movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Return data about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
  movies.findOne({ title: req.params.title })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Return data about a genre by name/title
app.get('/movies/genre/:genreName', (req, res) => {
  movies.findOne({ "genre.name" : req.params.genreName })
  .then((movie) => {
    res.json(movie.genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Return data about a director (bio, birth year, death year) by name
app.get('/movies/director/:directorName', (req, res) => {
  movies.findOne({ "director.name" : req.params.directorName })
  .then((movie) => {
    res.json(movie.director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Return a list of ALL users
app.get('/users', (req, res) => {
  users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Return data about user by Username
app.get('/users/:userName', (req, res) => {
  users.findOne({ username: req.params.userName })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Allow new user to register
app.post('/users', (req, res) => {
  users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + 'already exists');
      } else {
        users
          .create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            birthday: req.body.birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//Allow user to update their info
app.put('/users/:userName', (req, res) => {
  users.findOneAndUpdate({ username: req.params.userName }, { $set:
    {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      birthday: req.body.birthday
    }
  },
  { new: true })
  .then(updatedUser => {
    res.json(updatedUser);
  })
  .catch(err => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//Let user add movies to their fasvorite list
app.post('/users/:userName/movies/:movieId', (req, res) => {
  users.findOneAndUpdate({ username: req.params.userName }, {
     $push: { favoriteMovies: req.params.movieId }
   },
   { new: true },)
   .then(updatedUser => {
     res.json(updatedUser);
   })
   .catch(err => {
     console.error(err);
     res.status(500).send('Error: ' + err);
   });
 });

//Allow user to remove movie from their favorite list
app.delete('/users/:userName/movies/:movieId', (req, res) => {
  users.findOneAndUpdate({ username: req.params.userName }, {
     $pull: { favoriteMovies: req.params.movieId }
   },
   { new: true })
   .then(updatedUser => {
     res.json(updatedUser);
   })
   .catch(err => {
     console.error(err);
     res.status(500).send('Error: ' + err);
   });
 });

//allow user to deregister
app.delete('/users/:userName', (req, res) => {
  users.findOneAndRemove({ username: req.params.userName })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.userName + ' was not found');
      } else {
        res.status(200).send(req.params.userName + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
  
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });