const express = require('express');
const Book = require('./../models/book');
const Chapter = require('./../models/chapter');
const User = require('./../models/user');
const router = express.Router();

router.post('/login', async (req, res) => {
	const userData = {
		name: req.body.username,
		pass: req.body.password,
	};
	if (userData.name && userData.pass) {
		await User.findOne({ nick_name: userData.name, password: userData.pass })
			.then((u) => {
				req.session.loggedin = true;
				req.session.username = u.nick_name;
				req.session.uuid = u._id;
				res.json({ found: true, session: req.session });
			})
			.catch((error) => {
				res.json({ error: error, respone: 'Could not find user with name or password' });
			});
	}
});

router.post('/register', async (req, res) => {
	const userData = {
		name: req.body.username,
		email: req.body.email,
		pass: req.body.password,
		dob: req.body.dob,
	};
	const newUser = await new User({
		nick_name: userData.name,
		e_mail: userData.email,
		password: userData.pass,
		dob: new Date(),
	});
	await newUser
		.save()
		.then((e) => {
			res.json({ respone: 'New User created' });
		})
		.catch((error) => {
			res.json(error);
		});
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
