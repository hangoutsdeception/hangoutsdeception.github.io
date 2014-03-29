// gapi can be loaded later
(function(window, gadgets, $) {

var root = '#main',
	roles = {
		good: [
			'Goodie 1',
			'Goodie 2',
			'Goodie Leader'
		],
		bad: [
			'Baddie 1',
			'Baddie 2',
			'Baddie Leader'
		]
	};

function logger() {
	if (DEBUG && console && console.log) {
		console.log.apply(console, arguments);
	}
}

function init() {
	initDom();

	// When API is ready...
	gapi.hangout.onApiReady.add(apiReadyHandler);
}

function initState() {
	var me = getMe();
	logger('My id', me);

	// register state listeners
	gapi.hangout.data.onStateChanged.add(stateChangedHandler);
	
	// if admin not set, set current user as admin
	logger('Current admin', getAdmin());
	if (!getAdmin()) {
		logger('Setting admin as me...');
		setAdmin(me);
	} else if (isAdmin()) {
		showAdminPanel();
	} else {
		hideAdminPanel();
	}
}

function initDom() {
	
}

function initAdminPanel() {
	var $admin = $('<div id="admin">'),
		$element;

	$admin.prependTo(root);

	//header
	$('<h1>')
		.text('Game Master')
		.appendTo($admin);

	// number of players
	$element = $('<div>');
	$element.appendTo($admin);

	$('<span>')
		.text('# players: ')
		.appendTo($element);

	$('<span data-name="numPlayers">')
		.appendTo($element);

	// player list
	$element = $('<div>');
	$element.appendTo($admin);

	$('<span>')
		.text('Players:')
		.appendTo($element);

	$('<ul data-name="playerList">')
		.appendTo($element);

	// roles
	$element = $('<div>');
	$element.appendTo($admin);

	$('<span>')
		.text('Good')
		.appendTo($element);

	$('<ul data-name="goodRoles">')
		.appendTo($element);

	$('<span>')
		.text('Bad')
		.appendTo($element);

	$('<ul data-name="badRoles">')
		.appendTo($element);

	populateRoles();
}

function populateRoles() {
	var $root = $(root),
		$list;

	// good roles
	$list = $root.find('[data-name="goodRoles"]')
		.empty();
	roles.good.forEach(function(role) {
		var $element = $('<li>'),
			$label = $('<label>')
				.text(role);
		$('<input>')
			.attr('type', 'checkbox')
			.attr('name', 'goodRole')
			.append($label);

		$label.appendTo($element);
		$element.appendTo($list);
	});

	// good roles
	$list = $root.find('[data-name="badRoles"]')
		.empty();
	roles.bad.forEach(function(role) {
		var $element = $('<li>'),
			$label = $('<label>')
				.text(role);
		$('<input>')
			.attr('type', 'checkbox')
			.attr('name', 'badRole')
			.append($label);

		$label.appendTo($element);
		$element.appendTo($list);
	});
}

function updateAdminPanel() {
	var $root = $(root),
		players = getPlayers(),
		$list = $root.find('[data-name="playerList"]');

	logger('players', players);

	$root.find('[data-name="numPlayers"]')
		.text(players ? players.length : 0);

	$list.empty();
	if (players) {
		players.forEach(function(player) {
			$('<li>')
				.text(player.person.displayName)
				.appendTo($list);
		});
	}
	
}

function showAdminPanel() {
	var $root = $(root);

	if ($root.find('#admin').size() == 0) {
		initAdminPanel();
	}
	
	updateAdminPanel();

	$('#admin')
		.css('visibility', 'visible');
}

function hideAdminPanel() {
	$('#admin')
		.css('visibility', 'hidden');
}

function isAdmin() {
	var me = getMe(),
		admin = getAdmin();
	return me === admin;
}

function getMe() {
	return gapi.hangout.getLocalParticipant().person.id;
	//return gapi.hangout.getLocalParticipantId();
}

function getAdmin() {
	return gapi.hangout.data.getValue('admin');
}

function setAdmin(value) {
	return gapi.hangout.data.setValue('admin', value);
}

function getPlayers() {
	return gapi.hangout.getEnabledParticipants();
}

function apiReadyHandler(event) {
	if (event.isApiReady) {
		initState();
	}
}

function stateChangedHandler(event) {
	logger('stateChangedHandler', event);
	logger(gapi.hangout.data.getState());
	
	if (isAdmin()) {
		showAdminPanel();
	} else {
		hideAdminPanel();
	}
}

window.DEBUG = true;

// Wait for gadget to load.
gadgets.util.registerOnLoadHandler(init);

}(window, gadgets, jQuery));