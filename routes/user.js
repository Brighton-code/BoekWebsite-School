const express = require('express');
const Book = require('./../models/book');
const Chapter = require('./../models/chapter');
const User = require('./../models/user');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/login', async (req, res) => {
	const userData = {
		name: req.body.username,
		pass: req.body.password,
	};
	if (userData.name && userData.pass) {
		await User.findOne({ nick_name: userData.name })
			.then((user) => {
				bcrypt.compare(userData.pass, user.password, function (error, isMatch) {
					if (error) {
						res.json({ error });
					} else if (!isMatch) {
						res.json({ respone: 'Password is incorrect' });
					} else {
						req.session.loggedin = true;
						req.session.username = user.nick_name;
						req.session.uuid = user._id;
						res.json({ found: true, session: req.session });
					}
				});
			})
			.catch((error) => {
				res.json({ error: error, respone: 'Could not find user with name' });
			});
	}
});

router.post('/register', async (req, res) => {
	const userData = {
		name: req.body.username,
		email: req.body.email,
		pass: req.body.password,
		dob: new Date(req.body.dob),
	};
	const newUser = await new User({
		nick_name: userData.name,
		e_mail: userData.email,
		password: userData.pass,
		dob: userData.dob,
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
	if (req.session) {
		req.session.destroy((err) => {
			if (err) {
				res.status(400).json({ error: 'Could not logout' });
			} else {
				res.json({ respone: 'Logged out' });
			}
		});
	}
});

router.get('/:nick', async (req, res) => {
	res.json({ message: 'Get user by slug', nick: req.params.nick });
});

router.get('/', async (req, res) => {
	res.json({ world: 'Hello World!' });
});

module.exports = router;
