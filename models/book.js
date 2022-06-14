const mongoose = require('mongoose');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);
const Chapters = require('./chapter');

const bookSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			maxlength: 500,
		},
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		chapters: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Chapter',
			},
		],
		published: {
			type: Boolean,
			default: false,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
		},
		sanitizedHtml: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true, collection: 'books' }
);

bookSchema.pre('validate', function (next) {
	if (this.title) {
		this.slug = slugify(`${this._id}-${this.title}`, {
			lower: true,
			strict: true,
		});
	}

	if (this.description) {
		this.sanitizedHtml = dompurify.sanitize(this.description);
	}

	next();
});

module.exports = mongoose.model('Book', bookSchema);
