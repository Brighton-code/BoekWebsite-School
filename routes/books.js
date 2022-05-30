const express = require('express');
// const Book = require('./../models/books');
const router = express.Router();

router.get('/', async (req, res) => {
	res.json({ test: 'hello world' });
});

module.exports = router;
