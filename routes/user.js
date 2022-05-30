const express = require('express');
const Book = require('./../models/book');
const Chapter = require('./../models/chapter');
const User = require('./../models/user');
const router = express.Router();

router.get('/login', async (req, res) => {
	res.json({ message: 'login' });
});

router.get('/register', async (req, res) => {
	res.json({ message: 'register' });
});

router.get('/logout', async (req, res) => {
	res.json({ message: 'logout' });
});

router.get('/:slug', async (req, res) => {
	res.json({ message: 'Get user by slug', slug: req.params.slug });
});

router.get('/', async (req, res) => {
	res.json({ world: 'Hello World!' });
});

module.exports = router;
