gui.handle.contacts = function()
{
	app.util.debug('log', 'Setting up Friend Picker');

	$('.find-a-friend').hammer(gui.touchOptions).bind(gui.touchEvents, function()
	{
		if(app.sharing_data)
		{
			app.util.debug('log', 'Currently Sharing Data. Contact Button Disabled.');

			return false;
		}

		app.util.debug('log', 'Picking a Friend ...');

		clearTimeout(gui.timeout.welcomeIn);
		clearTimeout(gui.timeout.welcomeOut);
		clearInterval(gui.timeout.welcome);

		$('.contact-options').hide();
		$('.contact-option').removeClass('animated swing');

		$('#home .welcome').removeClass('animated fadeInUp fadeOutDown').hide();

		if(typeof navigator.contacts !== 'undefined')
		{
			navigator.contacts.pickContact(function(contact)
			{
				app.io.friend = contact;
				gui.render.contact.update(contact);

			}, function(err){ gui.render.contact.reset(err); });

			app.stats.event('Navigation', 'Contact', 'Picking Contact');

			return false;
		}
		else
		{
			app.util.debug('warn', 'This Device does not support Contacts');
			app.stats.event('Navigation', 'Contact Error', 'Device Does Not Support Contacts');
			app.util.debug('debug', 'Generating Fake Contact for Dev Purposes');

			fake_data.contact.name.givenName = app.locale.dict('tour', 'first_name');
			fake_data.contact.name.formatted = app.locale.dict('tour', 'full_name');
			fake_data.contact.name.familyName = app.locale.dict('tour', 'last_name');

			app.io.friend = fake_data.contact;

			gui.render.contact.update(app.io.friend);

			return false;
		}
	});

	var user_shuffle = 0;
	setInterval(function()
	{
		var friends = $('.find-a-friend.default');
		var width = friends.width();

		user_shuffle++;

		if(user_shuffle > 9)
		{
			user_shuffle = 0;
		}

		var position = -(user_shuffle * width);

		friends.attr('style', '').css('background-position', position + 'px 0px');
	}, 4000);

	$('.force-reset-gui').hammer(gui.touchOptions).bind(gui.touchEvents, function()
	{
		app.util.debug('log', 'Resetting GUI ...');
		gui.reset();

		return false;
	});
};
