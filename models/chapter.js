const mongoose = require('mongoose');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);
const Book = require('./book');

const chapterSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
			maxlength: 1000000,
		},
		book_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Book',
		},
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
	{ timestamps: true, collection: 'chapters' }
);

chapterSchema.pre('validate', function (next) {
	if (this.title) {
		this.slug = slugify(`${this._id}-${this.title}`, {
			lower: true,
			strict: true,
		});
	}

	if (this.text) {
		this.sanitizedHtml = dompurify.sanitize(this.text);
	}

	next();
});

module.exports = mongoose.model('Chapter', chapterSchema);
