const express = require('express');
const session = require('express-session');
const User = require('../models/user');
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
	loggedin(),
	async (req, res, next) => {
		req.book = await new Book();
		next();
	},
	saveBookAndRedirect('new')
);

router.post('/:slug/new', loggedin(), async (req, res) => {
	const book = await Book.findOne({ slug: req.params.slug, user_id: req.session.uuid });
	if (book) {
		const chapter = await new Chapter({
			title: req.body.title,
			text: req.body.text,
			book_id: book._id,
		});
		book.chapters.push(chapter._id);
		await chapter.save().catch((err) => res.json({ err: err }));
		await book.save().catch((err) => res.json({ err: err }));
		res.json({ book: book, chapter: chapter });
	} else {
		res.json({ respone: 'User is not owner of book to add chapter' });
	}
});

router.get('/:slugBook/:slugChapter', async (req, res) => {
	await Chapter.findOne({ slug: req.params.slugChapter })
		.then((chapter) => {
			if (chapter) res.json({ chapter });
			else res.json({ error: 'no chapter found with slug' });
		})
		.catch((error) => {
			res.json({ error });
		});
});

router.put(
	'/:id',
	loggedin(),
	async (req, res, next) => {
		// req.book = await Book.findById(req.params.id);
		req.book = await Book.findOne({ _id: req.params.id, user_id: req.session.uuid });
		if (req.book) {
			next();
		} else {
			res.json({ respone: 'User does not own book' });
		}
	},
	saveBookAndRedirect('update')
);

router.delete('/:id', loggedin(), async (req, res) => {
	const book = await Book.findOne({ _id: req.params.id, user_id: req.session.uuid });
	if (book) {
		await Book.deleteOne({ _id: req.params.id });
	} else {
		res.json({ respone: 'User does not own book' });
	}
	res.redirect('/');
});

function saveBookAndRedirect(path) {
	return async (req, res) => {
		let book = req.book;
		if (req.body.title) book.title = req.body.title;
		if (req.body.description) book.description = req.body.description;
		if (req.body.published) book.published = req.body.published;
		if (path === 'new') {
			book.user_id = req.session.uuid;
			const user = await User.findById(req.session.uuid);
			user.books.push(book._id);
			await user.save().catch((err) => res.json({ err: err }));
		}
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

function loggedin() {
	return async (req, res, next) => {
		if (req.session.loggedin) {
			next();
		} else {
			res.json({ respone: 'Please log in before proceeding' });
		}
	};
}

module.exports = router;
