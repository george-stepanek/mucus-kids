var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Comment Model
 * =============
 */

var Comment = new keystone.List('Comment', {
});

Comment.add({
	name: { type: Types.Text },
	message: { type: Types.Textarea, required: true, initial: false },
	createdAt: { type: Types.Datetime, required: true, default: Date.now },
	isAdmin: { type: Types.Boolean, default: false },
});

Comment.defaultSort = '-createdAt';
Comment.defaultColumns = 'name, createdAt, isAdmin, message';
Comment.register();
