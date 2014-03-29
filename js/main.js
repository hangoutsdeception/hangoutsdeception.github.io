// gapi may be loaded later
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
	
	if (!hasGameStarted()) {
		if (!getAdmin()) {
			logger('Setting admin as me...');
			setAdmin(me);
		} else if (isAdmin()) {
			showAdminPanel();
		} else {
			hideAdminPanel();
			showWaitingPanel();
		}
	} else {
		hideAdminPanel();
		hideWaitingPanel();
		showGamePanel();
	}
}

function initDom() {}

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

	// start game button
	$('<button>')
		.text('Start!')
		.click(startHandler)
		.appendTo($root);
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
			.prependTo($label);

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
			.prependTo($label);

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

function initWaitingPanel() {
	logger('initWaitingPanel: implement');
}

function updateWaitingPanel() {
	logger('updateWaitingPanel: implement');
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

function showWaitingPanel() {
	var $root = $(root);

	if ($root.find('#waiting').size() == 0) {
		initWaitingPanel();
	}

	updateWaitingPanel();

	$('#waiting')
		.css('visibility', 'visible');
}

function hideWaitingPanel() {
	$('#waiting')
		.css('visibility', 'hidden');
}

function showGamePanel() {
	logger('showGamePanel: implement');
}

function hideGamePanel() {
	logger('hideGamePanel: implement');
}

// returns an object where the keys are Person.id and the values are Role.id
function assignRoles() {
	var players = getPlayers(),
		roles = getSelectedRoles();

	// TODO assign one role per player without repeats
	// counts for total goodies and badies is preset based on number of players
	// there must be 1 non-special baddie
	// there is always 1 merlin, 1 assassin

	return {};
}

//
// Accessor and accessor helpers
//

function isAdmin() {
	return getMe() === getAdmin();
}

function getMe() {
	return gapi.hangout.getLocalParticipant().person.id;
}

function getAdmin() {
	return gapi.hangout.data.getValue('admin.personId');
}

function setAdmin(value) {
	return gapi.hangout.data.setValue('admin.personId', value);
}

function getPlayers() {
	return gapi.hangout.getEnabledParticipants();
}

function getSelectedRoles() {
	return {
		good: [],
		bad: []
	};
}

function getPlayerRoleMap() {
	var string = gapi.hangout.data.getValue('admin.playerRoleMap');
	return $.parseJSON(string);
}

// build state object for playerRoleMap
function buildPlayerRoleMap(value) {
	return {
		'admin.playerRoleMap': JSON.stringify(value)
	};
}

function hasGameStarted() {
	return gapi.hangout.data.getValue('admin.hasGameStarted') === 'true';
}

// build state object for hasGameStarted
function buildHasGameStarted(value) {
	return {
		'admin.hasGameStarted': ''+value
	};
}

function changeState(changes) {
	gapi.hangout.data.submitDelta(changes, []);
}

//
// User Interaction Handlers
//

function startHandler() {
	logger('Starting game');

	var assignments = assignRoles();
	changeState($.extend(buildPlayerRoleMap(assignments), buildHasGameStarted(true)));
}

//
// Hangout Handlers
//

function apiReadyHandler(event) {
	if (event.isApiReady) {
		initState();
	}
}

function stateChangedHandler(event) {
	logger('stateChangedHandler', event);
	logger(event.state);

	event.addedKeys.forEach(function(meta) {
		switch (meta.key) {
			case 'admin.personId': {
				if (isAdmin()) {
					showAdminPanel();
				} else {
					hideAdminPanel();
				}
				break;
			}
			case 'admin.hasGameStarted': {
				// TODO implement
				logger('todo change ui');
				break;
			}
			case 'admin.playerRoleMap': {
				// TODO implement
				logger('show roles based on role types');
				break;
			}
			default: {
				// do nothing
			}
		}
	});
}

window.DEBUG = true;

// Wait for gadget to load.
gadgets.util.registerOnLoadHandler(init);

}(window, gadgets, jQuery));