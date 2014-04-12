// gapi may be loaded later
(function(window, gadgets, $) {

// TODO enable start when enough roles are selected for number of people

var DEV = true,			// true if in development

	root = '#main',

	roleDistribution = {
		5: createTeamTuple(3, 2),
		6: createTeamTuple(4, 2),
		7: createTeamTuple(4, 3),
		8: createTeamTuple(5, 3),
		9: createTeamTuple(6, 3),
		10: createTeamTuple(6, 4)
	};

function logger() {
	if (DEBUG && console && console.log) {
		console.log.apply(console, arguments);
	}
}

// helper for creating a common tuple
function createTeamTuple(bastion, legion) {
	return {
		bastion: bastion,
		legion: legion
	};
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
			hideWaitingPanel();
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

	$admin.appendTo(root);

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
	$element = $('<div data-name="roles">');
	$element
		.on('change', ':checkbox', adminRolesChangedHandler)
		.appendTo($admin);

	populateRoles();

	// start game button
	$('<button>')
		.text('Start!')
		.click(startHandler)
		.appendTo(root);
}

function populateRoles() {

	var $roles = $(root).find('[data-name="roles"]');

	$roles.empty();

	$.each(teams(), function(id, team) {
		var listName = id + 'Roles',
			$list = $('<ul data-name="' + listName + '">');

		$('<span>')
			.text(team.name)
			.appendTo($roles);

		$list
			.addClass('no-bullets')
			.appendTo($roles);

		team.members.forEach(function(roleId) {
			var role = getRole(roleId),
				$element = $('<li>'),
				$label = $('<label>');

			if (!role) {
				logger(role, roleId, roles());
				return;
			}

			if (role.allowMultiple) {
				return;
			}

			$label
				.text(role.name)
				.appendTo($element);

			$element.appendTo($list);

			$('<input>')
				.attr('type', 'checkbox')
				.attr('name', role.id)
				.prependTo($label);
		});
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
	var $waiting = $('<div id="waiting">');
	$waiting.appendTo(root);

	$('<span>')
		.text('Waiting for ')
		.appendTo($waiting);

	$('<span data-name="adminDisplay">')
		.appendTo($waiting);

	$('<span>')
		.text(' to start the game...')
		.appendTo($waiting);
}

function updateWaitingPanel() {
	$('#waiting [data-name="adminDisplay"]')
		.text(getDisplayNameForId(getAdmin()));
}

function showAdminPanel() {
	var $root = $(root);

	if ($root.find('#admin').size() == 0) {
		initAdminPanel();
	}

	updateAdminPanel();
	gapi.hangout.onEnabledParticipantsChanged.add(participantsChangedHandler);

	$('#admin')
		.css('visibility', 'visible');
}

function participantsChangedHandler() {
	if (hasGameStarted() || !isAdmin()) {
		logger("Game has already started or I am not Admin");
		return;
	}
	updateAdminPanel();
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
	$('<div>')
		.text('Playing The Game')
		.appendTo(root);
}

function hideGamePanel() {
	logger('hideGamePanel: implement');
}

function pickRoles(numPlayers) {
	// TODO there must be 1 non-special baddie
	// TODO there is always 1 oracle, 1 azazel

	var selectedRoles = getSelectedRoles(),
		pickedRoles = [],
		distribution = roleDistribution[numPlayers];

	if (DEV && !distribution) {
		distribution = createTeamTuple(1, 1);
	}

	if (!distribution) {
		logger('wrong number of players!');
		return null;
	}

	logger('Selected roles', selectedRoles);
	logger('Distribution', distribution);

	$.each(distribution, function(key, value) {
		var subsetOfRoles = selectedRoles[key],
			count;

		pickedRoles = pickedRoles.concat(subsetOfRoles);

		for (count = value - selectedRoles.length; count > 0; count--) {
			pickedRoles.push(roles[name][0]);
		}
	});

	return pickedRoles;
}

// returns an object where the keys are Person.id and the values are Role.id
function assignRoles() {
	var players = getPlayers(),
		pickedRoles = pickRoles(players.length),
		assignments = {};

	logger('Players', players);
	logger('Picked Roles', pickedRoles);

	players.forEach(function(player) {
		var random = Math.floor(Math.random() * (pickedRoles.length - 1));
		assignments[player.person.id] = pickedRoles[random];
		pickedRoles.splice(random, 1);
	});

	return assignments;
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

function getDisplayNameForId(id) {
	var players = getPlayers() || [],
		player,
		index;

	for (index = 0; index < players.length; index++) {
		player = players[index];
		if (player.person.id === id) {
			return player.person.displayName;
		}
	}

	return '<Cannot find Admin>';
}

function getSelectedRoles() {
	var ret = {};

	$.each(teams(), function(id) {
		ret[id] = extractSelectedRoles(id + 'Roles');
	});

	return ret;
}

function extractSelectedRoles(name) {
	return $(root).find('[data-name="' + name + '"] :checked')
		.map(function() {
			return $(this).attr('name');
		})
		.get();
}

function getPlayerRoleMap() {
	var string = gapi.hangout.data.getValue('admin.playerRoleMap');
	return $.parseJSON(string);
}

function teams() {
	return (window.HangoutsDeception && window.HangoutsDeception.teams) || {};
}

function roles() {
	return (window.HangoutsDeception && window.HangoutsDeception.roles) || {};
}

function getRole(id) {
	return roles()[id];
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

// Called when the role inputs in the Admin Panel change
function adminRolesChangedHandler() {
	logger('TODO implement Start button disabling based on role checks');
}

function startHandler() {
	logger('Starting game');

	var assignments = assignRoles();
	logger('assigned roles', assignments);
//	changeState($.extend(buildPlayerRoleMap(assignments), buildHasGameStarted(true)));
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
					hideWaitingPanel();
				} else {
					hideAdminPanel();
					showWaitingPanel();
				}
				break;
			}
			case 'admin.hasGameStarted': {
				showGamePanel();
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