(function(window) {

if (!window.HangoutsDeception) {
	window.HangoutsDeception = {};
}

window.HangoutsDeception.teams = {
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

window.HangoutsDeception.perceivedAs: {
	purple: "purple",
	red: "red",
	yellow: "red",
	orange: "red"
};

window.HangoutsDeception.roles: {
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
		knows: ["purple"],
		allowMultiple: false
	},
	oracle: {
		id: "oracle",
		name: "Oracle",
		is: ["purple"]
		knows: ["red", "yellow"],
		allowMultiple: false
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
		is: ["red"]
		knows: ["red", "orange"],
		allowMultiple: false,
		finalKiller: true
	},
	succubus: {
		id: "succubus",
		name: "Succubus",
		is: ["red", "purple"],
		knows: ["red", "orange"],
		allowMultiple: false
	},
	lucifier: {
		id: "lucifer",
		name: "Lucifer",
		is: ["orange"],
		knows: ["red"],
		allowMultiple: false
	},
	lilith: {
		id: "lilith",
		name: "Lilith",
		is: ["orange", "purple"],
		knows: ["red"],
		allowMultiple: false
	},
	zombie: {
		id: "zombie",
		name: "Zombie",
		is: ["yellow"],
		knows: [],
		allowMultiple: false
	}
};

window.HangoutsDeception.dataLoaded = true;

}(window));
