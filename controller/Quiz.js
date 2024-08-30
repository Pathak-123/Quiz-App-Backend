
const express = require('express');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const slugify = require('slugify');




const createQuiz = async (req, res) => {

    const { name, type, questions, user } = req.body;
    const userId = req.user._id;

    if (!name || !type || !questions || !userId)
        return res.status(499).json({
            message: "Please fill all the mandatory fields"
        });

    try {
        const quiz = await Quiz.create({
            user: userId,
            name,
            type,
            questions
        })
        return res.status(201).json({
            success: true,
            message: "Quiz Created Successfully",
            quizId: quiz._id
        })

    }
    catch (e) {
        res.status(500).send("Server Error");

    }


};




const updateQuizImpression = async (req, res) => {

    try {

        const quiz = await Quiz.findById(req.params.id);

        if (!quiz)
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });

        quiz.impressions++;
        await quiz.save();

        return res.status(200).json({
            success: true,
            quiz
        });

    }
    catch (e) {

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }


};

const getQuizForAnalysis = async (req, res) => {

    try {

        const quiz = await Quiz.findById(req.params.id);

        if (!quiz)
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });



        return res.status(200).json({
            success: true,
            quiz
        });

    }
    catch (e) {

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }


};




const editQuiz = async (req, res) => {

    const { name, type, questions } = req.body;

    try {

        const quiz = await Quiz.findById(req.params.id);

        if (!quiz)
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });

        if (name) quiz.name = name;
        if (type) quiz.type = type;
        if (questions) quiz.questions = questions;

        await quiz.save();

        return res.status(200).json({
            success: true,
            quiz
        });

    }
    catch (e) {

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }


};

const deleteQuiz = async (req, res) => {
    try {

        const quiz = await Quiz.findById(req.params.id);

        if (!quiz)
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });

        await quiz.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Quiz Deleted Successfully"
        });

    }
    catch (e) {

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }


};

const publishQuiz = async (req, res) => {
    try {

        const quiz = await Quiz.findById(req.params.id);

        if (!quiz)
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });

        const slugTitle = slugify(quiz.name, { lower: true, strict: true });

        const quizLink = `${slugTitle}_${quiz._id}`;
        quiz.published = true;

        await quiz.save();

        return res.status(200).json({
            success: true,
            quizLink
        });

    }
    catch (e) {

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }


};

const getPublishedQuiz = async (req, res) => {

    try {
        const { slugID } = req.params;
        const [slug, id] = slugID.split('_');


        const quiz = await Quiz.findById(id);

        if (!quiz || !quiz.published)
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });



        return res.status(200).json({
            success: true,
            quiz
        });

    }
    catch (e) {

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }


};

const myQuiz = async (req, res) => {

    try {
        const id = req.user._id;

        const quiz = await Quiz.find({ user: id });

        if (!quiz.length)
            return res.status(200).json({
                success: false,
                message: 'No Quiz found'
            });




        return res.status(200).json({
            success: true,
            quiz
        });

    }
    catch (e) {

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }


};



const updateQuestionImpression = async (req, res) => {
    const { questionId } = req.params;

    try {
        const quiz = await Quiz.findOne({ 'questions._id': questionId });
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz or question not found' });
        }


        const question = quiz.questions.id(questionId);
        if (question) {
            question.QuestionImpressions += 1;
            await quiz.save();
            return res.status(200).json({ message: 'Question impression updated successfully' });
        } else {
            return res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        console.error('Error updating question impression:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


const updateCorrectAnswerCount = async (req, res) => {
    const { questionId, optionId } = req.params;

    try {
        const quiz = await Quiz.findOne({ 'questions._id': questionId });
        if (!quiz) {
            return res.status(204).json({ message: 'No content to update' });
        }



        const question = quiz.questions.id(questionId);
        if (!question) {
            return res.status(204).json({ message: 'No content to update' });
        }

        if (!optionId) {
            return res.status(204).json({ message: 'No option ID provided' });
        }

        const selectedOption = question.questionOptions.id(optionId);
        if (!selectedOption) {

            return res.status(204).json({ message: 'No content to update' });
        }

        if (quiz.type === 'poll') {
            selectedOption.selectedCount += 1;
            await quiz.save();
            return res.status(200).json({ message: 'Option count updated successfully' });
        }
        if (selectedOption.isCorrect) {
            question.correctAnswer += 1;
            await quiz.save();
            return res.status(200).json({ message: 'Correct answer count updated successfully' });
        } else {
            return res.status(200).json({ message: 'Selected option is not correct' });
        }
    } catch (error) {
        console.error('Error updating correct answer count:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};




module.exports = { createQuiz, updateQuizImpression, editQuiz, deleteQuiz, publishQuiz, getPublishedQuiz, myQuiz, getQuizForAnalysis, updateQuestionImpression, updateCorrectAnswerCount }

