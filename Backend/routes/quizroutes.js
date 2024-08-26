const express = require('express');
const router = express.Router();
const {
    createQuiz, 
    updateQuiz, 
    deleteQuiz,  
    getQuizzesByUserId, 
    updateCorrectAnswers, 
    getQuizById, 
    updateChosenOption
} = require('../controllers/quizControllers');

router.post('/createQuiz', createQuiz);// Create Quiz
router.put('/updateQuiz/:id', updateQuiz); //Edit Quiz
router.delete('/deleteQuiz/:id', deleteQuiz); // Delete Quiz
router.get('/getQuiz/:quizId', getQuizById); // Get Quiz Details for Quiz Interface (No Authorization for ananymous user)
router.get('/getQuizzesByUserId/', getQuizzesByUserId); // Quizes Created by user
router.post('/updateCorrectAnswers', updateCorrectAnswers); // update correct answers from Quiz Interface
router.post('/updateChosenOption',updateChosenOption) //update Choosen option for QuestionWise Analytics


module.exports = router;
