// gapi can be loaded later
(function(window, gadgets, $) {

function logger() {
	if (DEBUG && console && console.log) {
		console.log.apply(null, arguments);
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

	// if admin not set, set current user as admin
	if (gapi.hangout.data.getValue('admin')) {
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
		logger('ME!', gapi.hangout.getLocalParticipantId());
		initState();
		//$('#showParticipants')
		//	.css('visibility', 'visible');
		showParticipants();
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