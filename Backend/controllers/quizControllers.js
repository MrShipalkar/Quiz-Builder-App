const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");

const createQuiz = async (req, res) => {
  const quizData = req.body;

  quizData.createdBy = req.user._id;

  try {
    // console.log("Attempting to save quiz:", JSON.stringify(quizData, null, 2));

    const newQuiz = new Quiz(quizData);
    await newQuiz.save();

    res.status(200).json({
      message: "Quiz created successfully",
      data: newQuiz,
      status: "ok",
    });
  } catch (err) {
    // console.error("Error during quiz creation:", err.message);
    res.status(400).json({
      message: "Error creating quiz",
      error: err.message,
    });
  }
};

const updateQuiz = async (req, res) => {
  const quizId = req.params.id;
  const userId = req.user._id;
  const quizData = req.body;

  try {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (quiz.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this quiz" });
    }

    Object.assign(quiz, quizData);
    await quiz.save();

    res.status(200).json({
      message: "Quiz updated successfully",
      data: quiz,
      status: "ok",
    });
  } catch (err) {
    res.status(400).json({
      message: "Error updating quiz",
      error: err.message,
    });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this quiz" });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting quiz", error: err.message });
  }
};

const updateCorrectAnswers = async (req, res) => {
  const { quizId, questionIndex } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.questions[questionIndex].correctAnswers += 1;

    await quiz.save();

    res
      .status(200)
      .json({ message: "Correct answers updated successfully", status: "ok" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error updating correct answers",
        error: error.message,
      });
  }
};

const getQuizzesByUserId = async (req, res) => {
  try {
    const userId = req.user._id;

    const quizzes = await Quiz.find({ createdBy: userId });

    const totalQuizzes = quizzes.length;
    let totalQuestions = 0;
    let totalImpressions = 0;

    quizzes.forEach((quiz) => {
      totalQuestions += quiz.questions.length;
      totalImpressions += quiz.impressions;

      quiz.questions.forEach((question) => {
        totalImpressions += question.impressions;
      });
    });

    res.json({
      totalQuizzes,
      totalQuestions,
      totalImpressions,
      quizzes,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getQuizById = async (req, res) => {
  try {
    const quizId = req.params.quizId;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    quiz.impressions += 1;
    await quiz.save();

    res.json({
      message: "Quiz fetched successfully",
      data: quiz,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateChosenOption = async (req, res) => {
  const { quizId, questionIndex, optionIndex } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.questions[questionIndex].options[optionIndex].choosen += 1;

    quiz.questions[questionIndex].impressions += 1;

    console.log(
      "Updated question impressions:",
      quiz.questions[questionIndex].impressions
    );
    console.log(
      "Updated option chosen count:",
      quiz.questions[questionIndex].options[optionIndex].choosen
    );

    await quiz.save();

    res
      .status(200)
      .json({ message: "Chosen option updated successfully", status: "ok" });
  } catch (error) {
    console.error("Error updating chosen option:", error);
    res
      .status(500)
      .json({ message: "Error updating chosen option", error: error.message });
  }
};

module.exports = {createQuiz,updateQuiz,deleteQuiz,getQuiz,getQuizzesByUserId,updateCorrectAnswers,getQuizById,updateChosenOption,ananymousUser,shareQuiz,};
