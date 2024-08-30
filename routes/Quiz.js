const express = require('express');
const  authFunction  = require('../middleware/auth');
const { createQuiz, publishQuiz, getPublishedQuiz, deleteQuiz, editQuiz, myQuiz, getQuizForAnalysis, updateQuizImpression, updateQuestionImpression, updateCorrectAnswerCount } = require('../controller/Quiz');

const router = express.Router(); 

router.post('/createQuiz', authFunction, createQuiz);

router.put('/impression/:id', updateQuizImpression);

router.get('/:id', authFunction, getQuizForAnalysis);

router.delete('/:id', authFunction, deleteQuiz);

router.put('/update/:id', authFunction, editQuiz);

router.put('/:id/publish', authFunction, publishQuiz);

router.get('/livequiz/:slugID', getPublishedQuiz);

router.get('/myQuiz/question',authFunction, myQuiz);

router.put('/questionimpression/:questionId', updateQuestionImpression);

router.put('/updateCorrect/:questionId/:optionId', updateCorrectAnswerCount);

module.exports = router;