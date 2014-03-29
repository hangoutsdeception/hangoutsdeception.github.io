// gapi can be loaded later
(function(window, gadgets, $) {

function logger(logs) {
	if (DEBUG && console && console.log) {
		console.log(logs || logs.join(' '));
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
	var me = gapi.hangout.getLocalParticipantId();

	// register state listeners
	gapi.hangout.data.onStateChanged.add(stateChangedHandler);

	// is admin set
	if (gapi.hangout.data.getValue('admin')) {
		// if not set current user as admin
		gapi.hangout.data.setValue('admin', me);
	}

	logger('My id', me);
	logger(gapi.hangout.data.getState());
}

function initDom() {
	var root = '#main';

	$('<button id="showParticipants">')
		.text('Show Participants')
		.click(showParticipants)
		.appendTo(root);

	$('<div id="participantsDiv">')
		.css('visiblility', 'hidden')
		.appendTo(root);
}

function apiReadyHandler(event) {
	if (event.isApiReady) {
		initState();
		$('#showParticipants')
			.css('visibility', 'visible');
	}
}

function stateChangedHandler(event) {
	// TODO implement
	logger('stateChangedHandler', event);
}

window.DEBUG = true;

// Wait for gadget to load.
gadgets.util.registerOnLoadHandler(init);

}(window, gadgets, jQuery));