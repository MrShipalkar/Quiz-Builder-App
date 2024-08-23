const express = require('express');
const router = express.Router();
const {createQuiz, updateQuiz, deleteQuiz, getQuiz,getQuizzesByUserId,updateCorrectAnswers, ananymousUser, shareQuiz} = require('../controllers/quizControllers');


router.post('/createQuiz', createQuiz);
router.put('/updateQuiz/:id',updateQuiz);
router.delete('/deleteQuiz/:id',deleteQuiz)
router.get('/getQuiz/:id', getQuiz)
router.get('/getQuizzesByUserId/',getQuizzesByUserId)
router.post('/updateCorrectAnswers',updateCorrectAnswers)
// router.get('/ananymousUser/:id',ananymousUser)
// router.post('/shareQuiz/:id', shareQuiz)


// router.post('/login', loginUser);


module.exports = router;

