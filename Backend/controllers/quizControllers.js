const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");


const createQuiz = async (req, res) => {
  const quizData = req.body;

  quizData.createdBy = req.user._id;

  try {
    // Add this log to see what exactly is being passed to the schema
    // console.log("Attempting to save quiz:", JSON.stringify(quizData, null, 2));

    const newQuiz = new Quiz(quizData);
    await newQuiz.save();

    res.status(200).json({
      message: "Quiz created successfully",
      data: newQuiz,
      status: "ok",
    });
  } catch (err) {
    // Add this log to see the error returned by Mongoose
    console.error("Error during quiz creation:", err.message);

    res.status(400).json({
      message: "Error creating quiz",
      error: err.message,
    });
  }
};





const updateQuiz = async (req, res) => {
  const quizId = req.params.id;
  const userId = req.user._id; // The ID of the currently authenticated user
  const quizData = req.body;

  try {
    // Find the quiz to be updated
    const quiz = await Quiz.findById(quizId);

    // Check if the quiz exists
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Check if the user is authorized to update this quiz
    if (quiz.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this quiz" });
    }

    // Update the quiz
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

    // Check if the current user is the creator of the quiz
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



  const getQuiz =  async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      res.status(200).json({
        message: 'Quiz retrieved successfully',
        data: quiz,
        status: 'ok'
      });
    } catch (err) {
      res.status(500).json({
        message: 'Error retrieving quiz',
        error: err.message
      });
    }
  };

  const updateCorrectAnswers = async (req, res) => {
    const { quizId, questionIndex } = req.body;

    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Increment the correctAnswers field for the specified question
        quiz.questions[questionIndex].correctAnswers += 1;

        await quiz.save();

        res.status(200).json({ message: 'Correct answers updated successfully', status: 'ok' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating correct answers', error: error.message });
    }
};

  const ananymousUser = async (req, res) => {
    try {
      // Find the quiz by ID
      const quiz = await Quiz.findById(req.params.id)
        .select('questions') // Select only the questions field
        .lean(); // Convert to a plain JavaScript object
  
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
  
      // Map the questions to include only necessary fields
      const formattedQuestions = quiz.questions.map(question => ({
        question: question.question,
        options: question.options.map(option => ({
          text: option.text,
          url: option.url,
          chosen: option.chosen // Include `chosen` if needed
        })),
        correctOption: question.correctOption // Include only the correct option index
      }));
  
      res.status(200).json({
        message: 'Quiz retrieved successfully',
        data: formattedQuestions,
        status: 'ok'
      });
    } catch (err) {
      res.status(500).json({
        message: 'Error retrieving quiz',
        error: err.message
      });
    }
  };


const shareQuiz = async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.id)
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      // Handle sharing logic, e.g., generate a shareable URL or log sharing actions
      res.status(200).json({ message: 'Quiz shared successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error sharing quiz', error: error.message });
    }
  };
  

  const getQuizzesByUserId = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find all quizzes created by the user
        const quizzes = await Quiz.find({ createdBy: userId });

        const totalQuizzes = quizzes.length;
        let totalQuestions = 0;
        let totalImpressions = 0;

        quizzes.forEach(quiz => {
            totalQuestions += quiz.questions.length;
            totalImpressions += quiz.impressions;

            quiz.questions.forEach(question => {
                totalImpressions += question.impressions;
            });
        });

        res.json({
            totalQuizzes,
            totalQuestions,
            totalImpressions,
            quizzes // Include quizzes in the response
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ error: 'Server error' });
    }
};



  

const getQuizById = async (req, res) => {
  try {
      const quizId = req.params.quizId;

      // Find the quiz by ID
      const quiz = await Quiz.findById(quizId);

      if (!quiz) {
          return res.status(404).json({ error: "Quiz not found" });
      }

      // Increment the quiz's impressions count
      quiz.impressions += 1;
      await quiz.save();

      // Send the quiz data back to the client
      res.json({
          message: "Quiz fetched successfully",
          data: quiz,
      });
  } catch (error) {
      console.error('Error fetching quiz:', error);
      res.status(500).json({ error: 'Server error' });
  }
};




module.exports = { createQuiz, updateQuiz, deleteQuiz, getQuiz,getQuizzesByUserId,updateCorrectAnswers,getQuizById, ananymousUser,shareQuiz};
