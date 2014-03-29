// gapi can be loaded later
(function(window, gadgets, $) {

var root = '#main';

function logger() {
	if (DEBUG && console && console.log) {
		console.log.apply(console, arguments);
	}
}

function showParticipants() {
	var participants = gapi.hangout.getParticipants();

	var retVal = '<p>Participants: </p><ul>';

	for (var index in participants) {
		var participant = participants[index];
		
		if (!participant.person) {
			retVal += '<li>A participant not running this app</li>';
		}
		retVal += '<li>' + participant.person.displayName + '</li>';
	}

	retVal += '</ul>';

	var div = document.getElementById('participantsDiv');

	div.innerHTML = retVal;
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
	}
}

function initDom() {
	$('<button id="showParticipants">')
		.text('Show Participants')
		.click(showParticipants)
		.appendTo(root);

	$('<div id="participantsDiv">')
		.css('visiblility', 'hidden')
		.appendTo(root);
}

function initAdminPanel() {
	var $admin = $('<div id="admin">')
		.text('TODO');
	
	$admin.prependTo(root);
}

function showAdminPanel() {
	var $root = $(root);

	if ($root.find('#admin').size() == 0) {
		initAdminPanel();
	}
	
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
	return gapi.hangout.getLocalParticipantId();
}

function getAdmin() {
	return gapi.hangout.data.getValue('admin');
}

function setAdmin(value) {
	return gapi.hangout.data.setValue('admin', value);
}

function apiReadyHandler(event) {
	if (event.isApiReady) {
		logger('ME!', getMe());
		initState();
		//$('#showParticipants')
		//	.css('visibility', 'visible');
		showParticipants();
	}
}

function stateChangedHandler(event) {
	// TODO implement
	logger('stateChangedHandler', event);
	logger(gapi.hangout.data.getState());
	
	if (isAdmin()) {
		showAdminPanel();
	}
}

window.DEBUG = true;

// Wait for gadget to load.
gadgets.util.registerOnLoadHandler(init);

}(window, gadgets, jQuery));