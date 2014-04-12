(function(window) {
'use strict';

var data = window.HangoutsDeception || {};
window.HangoutsDeception = data;

data.teams = {
	bastion: {
		id: "bastion",
		name: "The Bastion",
		members: ["oracle", "paladin", "sentinel"],
		color: '#0000FF'
	},
	legion: {
		id: "legion",
		name: "The Legion",
		members: ["azazel", "succubus", "lucifer", "lilith", "zombie", "wraith"],
		color: '#FF0000'
	}
};

data.perceivedAs = {
	purple: "purple",
	red: "red",
	yellow: "red",
	orange: "red"
};

data.roles = {
	sentinel: {
		id: "sentinel",
		name: "Sentinel",
		is: [],
		knows: [],
		allowMultiple: true
	},
	paladin: {
		id: "paladin",
		name: "Paladin",
		is: [],
		knows: ["purple"]
	},
	oracle: {
		id: "oracle",
		name: "Oracle",
		is: ["purple"],
		knows: ["red", "yellow"]
	},
	wraith: {
		id: "wraith",
		name: "Wraith",
		is: ["red"],
		knows: ["red", "orange"],
		allowMultiple: true
	},
	azazel: {
		id: "azazel",
		name: "Azazel",
		is: ["red"],
		knows: ["red", "orange"],
		finalKiller: true
	},
	succubus: {
		id: "succubus",
		name: "Succubus",
		is: ["red", "purple"],
		knows: ["red", "orange"]
	},
	lucifer: {
		id: "lucifer",
		name: "Lucifer",
		is: ["orange"],
		knows: ["red"]
	},
	lilith: {
		id: "lilith",
		name: "Lilith",
		is: ["orange", "purple"],
		knows: ["red"]
	},
	zombie: {
		id: "zombie",
		name: "Zombie",
		is: ["yellow"],
		knows: []
	}
};

}(window));
