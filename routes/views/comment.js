var keystone = require('keystone');
var Comment = keystone.list('Comment');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'comments';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;
	locals.data = {
		posts: [],
	};

	function loadPosts (next) {
		var q = keystone.list('Comment').paginate({
			page: req.query.page || 1,
			perPage: 20,
			maxPages: 10,
		}).sort('-createdAt');

		q.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});
	}

	// Load the posts
	view.on('init', function (next) {
		loadPosts(next);
	});


	// On POST requests, add the Comment item to the database
	view.on('post', { action: 'comment' }, function (next) {

		var newComment = new Comment.model();
		var updater = newComment.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, message, isAdmin',
			errorMessage: 'There was a problem submitting your comment:',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
				next();
			} else {
				locals.enquirySubmitted = true;
				loadPosts(next);
			}
		});
	});

	view.render('comment');
};
