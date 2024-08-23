const mongoose = require("mongoose");

const OptionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: function() {
      return !this.url; // If URL is provided, text is not required
    },
  },
  url: {
    type: String,
    required: function() {
      return !this.text; // If text is provided, URL is not required
    },
  },
  choosen: {
    type: Number,
    default: 0,
  },
});

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  impressions: {
    type: Number,
    default: 0,
  },
  optionType: {
    type: String,
    enum: ["Text", "Image URL", "Text & Image URL"],
    default: "Text",
  },
  options: {
    type: [OptionSchema],
    validate: {
      validator: function(options) {
        // Ensure at least one valid option exists with either text or URL
        return options.every(option => option.text || option.url);
      },
      message: "Each option must have either text or an image URL."
    },
  },
  timer: {
    type: Number,
    default: 0,
  },
  correctAnswers: {
    type: Number,
    default: 0,
  },
  correctOption: {
    type: Number,
  },
});

const QuizSchema = new mongoose.Schema({
  quizName: {
    type: String,
    required: true,
  },
  quizType: {
    type: String,
    enum: ["Poll", "Q & A"],
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  impressions: {
    type: Number,
    default: 0,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  questions: [QuestionSchema],
});

const Quiz = mongoose.model("Quiz", QuizSchema);
module.exports = Quiz;
