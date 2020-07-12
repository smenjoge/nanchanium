const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
    type: {
        type: String,
        enum: ["cardio", "resistance"],
        required: [true, "Exercise Type is required"]
    },
    name: {
        type: String,
        required: [true, "Exercise Name is required"]
    },
    duration: {
        type: Number,
        required: [true, "Exercise Duration is required"]
    },
    weight: {
        type: Number
    },
    reps: {
        type: Number
    },
    sets: {
        type: Number
    },
    distance: {
        type: Number
    }
});

const Exercise = mongoose.model("Workout", ExerciseSchema);

module.exports = Exercise;


