'use strict';

var parent = module.parent.exports,
	passport = require.main.require('passport'),
	nconf = require.main.require('nconf'),
	Controllers = {};

Controllers.renderLogin = function(req, res, next) {
	if (req.session.tfa === true) {
		return res.redirect(req.query.next || '/');
	}

	parent.hasKey(req.user.uid, function(err, hasKey) {
		if (err) {
			return next(err);
		}

		if (!hasKey) {
			return next();
		}

		res.render('login-2factor', {
			error: req.flash('error')[0]
		});
	});
};

Controllers.processLogin = function(req, res, next) {
	passport.authenticate('totp', { failureRedirect: nconf.get('relative_path') + '/login/2fa', failureFlash: 'The verification code you&apos;ve entered is not correct' })(req, res, next);
};

Controllers.renderAdminPage = function(req, res, next) {
	res.render('admin/plugins/2factor', {});
};

Controllers.renderSettings = function(req, res, next) {
	if (res.locals.uid !== req.user.uid) {
		return res.render('403', {});
	}

	parent.hasKey(req.user.uid, function(err, hasKey) {
		res.render('account/2factor', {
			showSetup: !hasKey
		});
	});
};

module.exports = Controllers;