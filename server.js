const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

app.get("/api/workouts", (req, res) => {
  db.Workout.find({})
    .populate("exercises")
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.post("/api/workouts", ({body}, res) => {
    db.Workout.create(body)
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.put("/api/workouts/:workoutId", (req, res) => {
    newExercise = req.body;
    db.Exercise.create(newExercise)
    .then(({ _id }) => db.Workout.findOneAndUpdate({_id: ObjectId(req.params.workoutId)}, { $push: { exercises: _id } }, { new: true }))
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

// app.get("/populateduser", (req, res) => {
//   // TODO
//   // =====
//   // Write the query to grab the documents from the User collection,
//   // and populate them with any associated Notes.
//   // TIP: Check the models out to see how the Notes refers to the User
//   db.User.find({})
//   .populate("notes")
//   .then(dbUser => {
//     res.json(dbUser);
//   })
//   .catch(err => {
//     res.json(err);
//   });
// });

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
