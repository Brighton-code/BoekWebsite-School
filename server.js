require('dotenv').config();
/* Requires */
const mongoose = require('mongoose');
const express = require('express');
const Book = require('./models/book');

/* MongoDB/Mongoose connection */
mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => console.log('Succefully connected to MongoDB'))
	.catch((error) => console.error(error));

/* App settings */
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

/* Routers */
const booksRouter = require('./routes/books');
const bookRouter = require('./routes/book');
const myworksRouter = require('./routes/myworks');
const userRouter = require('./routes/user');

/* Routes */
app.get('/', async (req, res) => {
	await Book.find({ published: true })
		.sort({ updatedAt: 'desc' })
		.limit(20)
		.then((books) => {
			res.render('homepage', { books });
		})
		.catch((error) => {
			// res.render('error', { error });
			res.json({ error, expected: error.kind, got: error.valueType });
		});
	// const books = await Book.find({ published: true }).sort({ updatedAt: 'desc' }).limit(2);
	// res.status(200).render('homepage', { books });
});
app.use('/books', booksRouter); /* For searching books by search parameters */
app.use('/book', bookRouter); /* For individual books and chapters */
app.use('/myworks', myworksRouter); /* For books and chapters (GET, POST, PUT, DELETE) */
app.use('/user', userRouter); /* For all things user (GET, POST, PUT, DELETE) */

/* Open server port */
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Listening on Port: ${PORT}`));
