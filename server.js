const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");
const { json } = require("express");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true, useFindAndModify: false });

app.get("/api/workouts", (req, res) => {
  db.Workout.aggregate([
      {$sort :{ day : -1}},
      { $limit : 1 },
      {$addFields: {totalDuration:{
                      $reduce: {
                                input: "$exercises",
                                initialValue: 0,
                                in: {$add : ["$$value", "$$this.duration"]}
                                }} }}
    ])
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});


app.get("/api/workouts/range", (req, res) => {
    db.Workout.find({}).limit(7)
      .then(dbWorkout => {
        res.json(dbWorkout);
      })
      .catch(err => {
        res.json(err);
      });
  });


app.post("/api/workouts", ({body}, res) => {
    let newWorkout = {
      day: new Date().setDate(new Date().getDate()),
      exercises: []
    }
    db.Workout.create(newWorkout)
    .then(dbWorkout => {
      console.log(`New Workout Added`, dbWorkout);
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.put("/api/workouts/:workoutId", (req, res) => {
    newExercise = req.body;
    db.Workout.findOneAndUpdate({_id: req.params.workoutId}, { $push: { exercises: newExercise } }, { new: true })
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "public/exercise.html"));
});

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "public/stats.html"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
