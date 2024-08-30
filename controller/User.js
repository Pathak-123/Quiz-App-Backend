
const express = require('express');
const zod = require("zod");
const jwt = require("jsonwebtoken");
const User = require('../models/User');
const bcrypt = require('bcrypt');



const newUser = async (req, res) => {

    const signupBody = zod.object({
        name: zod.string(),
        email: zod.string().email(),
        password: zod.string()
    });

    const { success } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Please enter correct inputs"
        })
    }
    try {

        const { email, name, password } = req.body;

        const existingUser = await User.findOne({ email });


        if (existingUser) {
            return res.status(411).json({
                message: "Email already taken, please try with another Email"
            })
        }

        const salt = await bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);


        const user = await User.create({
            email,
            name,
            password: hash
        })
        const token = jwt.sign({
            _id: user._id
        }, process.env.TOKEN_SECRET);

        return res.status(201).json({
            success: true,
            token: token,
            message: `Welcome, ${user.name}`,
        })
    }
    catch (e) {
        res.status(500).send("Server Error");

    }
};




const Login = async (req, res) => {

    const signinBody = zod.object({
        email: zod.string().email(),
        password: zod.string()
    });

    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Please enter correct inputs"
        })
    }
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            email
        });
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const userPassword = await bcrypt.compareSync(password, user.password);

        if (!userPassword) {
            return res.status(400).send('Email or Password is Incorrect');
        }

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.json({
            email: user.email,
            token
        })
    }

    catch (e) {
        return new Error(e.message);
    }
};


const updatePassword = async (req, res) => {

    const updateBody = zod.object({
        password: zod.string(),
        email: zod.string(),
        newPassword: zod.string()
    });


    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Error while updating information"
        })
    }

    try {
        const { email, password, newPassword } = req.body;
        // const token = req.headers['authorization'];
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Email or Password is wrong');
        }
        const userPassword = bcrypt.compareSync(password, user.password);
        if (!userPassword) {
            return res.status(400).send('email or password is wrong');
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);
        await User.findOneAndUpdate({ email: user.email }, { password: hash });
        res.json({
            message: 'Password updated successfully'
        })
    }
    catch (e) {
        throw new Error(e.message);
    }
};

module.exports = { newUser, Login, updatePassword }

