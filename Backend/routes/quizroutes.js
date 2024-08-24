const express = require('express');
const router = express.Router();
const {
    createQuiz, 
    updateQuiz, 
    deleteQuiz, 
    getQuiz, 
    getQuizzesByUserId, 
    updateCorrectAnswers, 
    getQuizById, 
    ananymousUser, 
    shareQuiz
} = require('../controllers/quizControllers');

router.post('/createQuiz', createQuiz);
router.put('/updateQuiz/:id', updateQuiz);
router.delete('/deleteQuiz/:id', deleteQuiz);
router.get('/getQuiz/:quizId', getQuizById); // Updated to get quiz by ID and increment impressions
router.get('/getQuizzesByUserId/', getQuizzesByUserId);
router.post('/updateCorrectAnswers', updateCorrectAnswers);
// Uncomment if you want to use them
// router.get('/ananymousUser/:id', ananymousUser);
// router.post('/shareQuiz/:id', shareQuiz);

module.exports = router;
