const express = require('express');
const Book = require('./../models/book');
const Chapter = require('./../models/chapter');
const router = express.Router();

router.get('/:slug', async (req, res) => {
	await Book.findOne({ slug: req.params.slug })
		.then((book) => {
			if (book) res.json({ book });
			else res.json({ error: 'no book found with slug' });
		})
		.catch((error) => {
			res.json({ error });
		});
});

router.post(
	'/',
	async (req, res, next) => {
		req.book = await new Book();
		next();
	},
	saveBookAndRedirect('new')
);

router.post('/:slug/new', async (req, res) => {
	const book = await Book.findOne({ slug: req.params.slug });
	const chapter = await new Chapter({
		title: req.body.title,
		text: req.body.text,
		book_id: book._id,
	});
	book.chapters.push(chapter._id);
	await chapter.save().catch((err) => res.json({ err: err }));
	await book.save().catch((err) => res.json({ err: err }));
	res.json({ book: book, chapter: chapter });
});

router.put(
	'/:id',
	async (req, res, next) => {
		req.book = await Book.findById(req.params.id);
		next();
	},
	saveBookAndRedirect('update')
);

router.delete('/:id', async (req, res) => {
	await Book.deleteOne({ _id: req.params.id });
	res.redirect('/');
});

function saveBookAndRedirect(path) {
	return async (req, res) => {
		let book = req.book;
		if (req.body.title) book.title = req.body.title;
		if (req.body.description) book.description = req.body.description;
		if (req.body.published) book.published = req.body.published;
		try {
			book = await book.save();
			res.redirect(`/book/${book.slug}`);
			// res.json({book: book})
		} catch (e) {
			// res.render(`books/${path}`, { book: book });
			res.json({ message: e });
		}
	};
}

module.exports = router;
