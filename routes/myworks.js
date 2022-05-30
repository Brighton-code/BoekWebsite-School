const express = require('express');
const Book = require('./../models/book');
const Chapter = require('./../models/chapter');
const router = express.Router();

router.get('/', async (req, res) => {
	res.json({ world: 'Hello World!' });
});

module.exports = router;
