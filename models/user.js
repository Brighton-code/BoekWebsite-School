const mongoose = require('mongoose');
// const slugify = require('slugify');
// const createDomPurify = require('dompurify');
// const { JSDOM } = require('jsdom');
// const dompurify = createDomPurify(new JSDOM().window);

const userSchema = new mongoose.Schema(
	{
		nick_name: {
			type: String,
			required: true,
			unique: true,
			minlength: 4,
			maxlength: 24,
		},
		e_mail: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		dob: {
			type: Date,
			required: true,
		},
		books: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Book',
			},
		],
	},
	{ timestamps: true, collection: 'users' }
);

module.exports = mongoose.model('User', userSchema);
