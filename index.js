const express = require('express'),
      bodyParser = require('body-parser'),
      uuid = require('uuid');

const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect('mongodb://127.0.0.1:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

const fs = require('fs');
const path = require('path');
const { title } = require('process');

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

//Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
  Movies.find()
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
  Movies.findOne({ Title: req.params.title })
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
  Movies.findOne({ "Genre.Name" : req.params.genreName })
  .then((movie) => {
    res.json(movie.Genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Return data about a director (bio, birth year, death year) by name
app.get('/movies/director/:directorName', (req, res) => {
  Movies.findOne({ "Director.Name" : req.params.directorName })
  .then((movie) => {
    res.json(movie.Director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Return a list of ALL users
app.get('/users', (req, res) => {
  Users.find()
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
  Users.findOne({ UserName: req.params.userName })
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
  Users.findOne({ UserName: req.body.UserName })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.UserName + 'already exists');
      } else {
        Users
          .create({
            UserName: req.body.UserName,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
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
  Users.findOneAndUpdate({ UserName: req.params.userName }, { $set:
    {
      UserName: req.body.UserName,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
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
app.post('/users/:userName/movies/:movieID', (req, res) => {
  Users.findOneAndUpdate({ UserName: req.params.userName }, {
     $push: { FavoriteMovies: req.params.movieID }
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
app.delete('/users/:userName/movies/:movieID', (req, res) => {
  Users.findOneAndUpdate({ UserName: req.params.userName }, {
     $pull: { FavoriteMovies: req.params.movieID }
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
  Users.findOneAndRemove({ UserName: req.params.userName })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
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

