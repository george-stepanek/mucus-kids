/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.user = req.user;
	res.locals.url = req.protocol + '://' + req.get('host') + req.originalUrl;
	res.locals.navLinks = [
		{ label: '<span class="glyphicon glyphicon-list-alt" title="News"></span>', key: 'blog', href: '/' },
		{ label: '<span class="glyphicon glyphicon-camera" title="Pix"></span>', key: 'gallery', href: '/pix' },
		{ label: '<span class="glyphicon glyphicon-comment" title="Comments"></span>', key: 'comments', href: '/comments' },
		{ label: '<span class="glyphicon glyphicon-envelope" title="Contact Us"></span>', key: 'contact', href: '/contact' },
	];

	var q = require('keystone').list('Page').model.find().where('state', 'published').sort('-publishedDate');
	q.exec(function (err, results) {
		for(var i = 0; i < results.length; i++) {
			res.locals.navLinks.push({ label: results[i].title, key: results[i].slug, href: "/page/" + results[i].slug});
		}
		next(err);
	});
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};
