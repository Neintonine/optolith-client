import keyMirror from 'keymirror';

export default keyMirror({
	
	// ServerActions
	RECEIVE_RAW_LISTS: null,
	
	// WaitStore
	WAIT_START: null,
	WAIT_END: null,
	
	// TabStore
	SHOW_TAB: null,
	SHOW_TAB_SECTION: null,
	
	// AuthStore
	RECEIVE_ACCOUNT: null,
	UPDATE_USERNAME: null,
	LOGOUT_SUCCESS: null,
	CLEAR_ACCOUNT: null,
	
	// Registration
	REGISTRATION_SUCCESS: null,
	
	// PaneStore
	HEROES_SHOW: null,
	HEROES_HIDE: null,
	COLLAPSE_HEROES: null,
	
	// HerolistStore
	RECEIVE_RAW_HEROLIST: null,
	FILTER_HEROLIST: null,
	SORT_HEROLIST: null,
	CHANGE_HEROLIST_VIEW: null,
	CREATE_NEW_HERO: null,
	RECEIVE_HERO: null,
	
	// ProfileStore
	UPDATE_HERO_NAME: null,
	UPDATE_HERO_AVATAR: null,
	UPDATE_FAMILY: null,
	UPDATE_PLACEOFBIRTH: null,
	UPDATE_DATEOFBIRTH: null,
	UPDATE_AGE: null,
	UPDATE_HAIRCOLOR: null,
	UPDATE_EYECOLOR: null,
	UPDATE_SIZE: null,
	UPDATE_WEIGHT: null,
	UPDATE_TITLE: null,
	UPDATE_SOCIALSTATUS: null,
	UPDATE_CHARACTERISTICS: null,
	UPDATE_OTHERINFO: null,
	REROLL_HAIRCOLOR: null,
	REROLL_EYECOLOR: null,
	REROLL_SIZE: null,
	REROLL_WEIGHT: null,

	UNLOAD_HERO: null,
	CLEAR_HERO: null,

	// PhaseStore
	INCREASE_PHASE: null,
	RESET_PHASE: null,
	FINALIZE_CHARACTER_CREATION: null,
	
	// CharbaseStore
	SET_RULES: null,
	SET_GENDER: null,
	SET_GP_MAXIMUM: null,
	SET_GP_FOR_ATTRIBUTES: null,
	SET_ATTRIBUTE_MAXIMUM: null,
	
	// RaceStore
	SELECT_RACE: null,
	FILTER_RACES: null,
	SORT_RACES: null,
	CHANGE_RACE_VALUE_VISIBILITY: null,
	
	// CultureStore
	SELECT_CULTURE: null,
	FILTER_CULTURES: null,
	SORT_CULTURES: null,
	CHANGE_CULTURE_VALUE_VISIBILITY: null,
	CHANGE_CULTURE_VIEW: null,
	CHANGE_CULTURE_PACKAGE: null,
	CHANGE_CULTURE_LITERACY: null,

	// ProfessionStore
	SELECT_PROFESSION: null,
	FILTER_PROFESSIONS: null,
	SORT_PROFESSIONS: null,
	CHANGE_PROFESSION_VIEW: null,
	ASSIGN_RCP_ENTRIES: null,
	
	// ProfessionVariantStore
	SELECT_PROFESSION_VARIANT: null,
	
	// AttributeStore
	ADD_ATTRIBUTE_POINT: null,
	REMOVE_ATTRIBUTE_POINT: null,
	ADD_MAX_ENERGY_POINT: null,

	// DisAdvStore
	FILTER_DISADV: null,
	CHANGE_DISADV_RATING: null,
	ACTIVATE_DISADV: null,
	DEACTIVATE_DISADV: null,
	UPDATE_DISADV_TIER: null,

	// TalentsStore
	FILTER_TALENTS: null,
	SORT_TALENTS: null,
	CHANGE_TALENT_RATING: null,
	ADD_TALENT_POINT: null,
	REMOVE_TALENT_POINT: null,

	// CombatTechniquesStore
	FILTER_COMBATTECHNIQUES: null,
	SORT_COMBATTECHNIQUES: null,
	ADD_COMBATTECHNIQUE_POINT: null,
	REMOVE_COMBATTECHNIQUE_POINT: null,
	
	// SpellsStore
	FILTER_SPELLS: null,
	SORT_SPELLS: null,
	UPDATE_SPELL_VIEW: null,
	ACTIVATE_SPELL: null,
	DEACTIVATE_SPELL: null,
	ADD_SPELL_POINT: null,
	REMOVE_SPELL_POINT: null,
	
	// LiturgiesStore
	FILTER_LITURGIES: null,
	SORT_LITURGIES: null,
	UPDATE_LITURGY_VIEW: null,
	ACTIVATE_LITURGY: null,
	DEACTIVATE_LITURGY: null,
	ADD_LITURGY_POINT: null,
	REMOVE_LITURGY_POINT: null,

	// SpecialAbilitiesStore
	FILTER_SPECIALABILITIES: null,
	SORT_SPECIALABILITIES: null,
	UPDATE_SPECIALABILITY_VIEW: null,
	ACTIVATE_SPECIALABILITY: null,
	DEACTIVATE_SPECIALABILITY: null,
	UPDATE_SPECIALABILITY_TIER: null,
	
	// GroupsStore
	SHOW_MASTER_REQUESTED_LIST: null,
	HIDE_MASTER_REQUESTED_LIST: null,
	
	// InGameStore
	LOAD_RAW_INGAME_DATA: null,
	INGAME_PREVIOUS_PHASE: null,
	INGAME_NEXT_PHASE: null,
	UPDATE_INGAME_CAST: null,
	CANCEL_INGAME_CAST: null,
	INGAME_USE_ENDURANCE: null,
	INGAME_USE_ACTION: null,
	INGAME_USE_FREE_ACTION: null,
	INGAME_ACTIVATE_FIGHTER: null,
	INGAME_DEACTIVATE_FIGHTER: null,
	INGAME_EDIT_START: null,
	INGAME_EDIT_UPDATE_VALUE: null,
	INGAME_EDIT_UPDATE_CAST_VALUE: null,
	INGAME_EDIT_UPDATE_DUPLICATE_VALUE: null,
	INGAME_EDIT_END: null,
	INGAME_ADD_FIGHTER: null,
	INGAME_DUPLICATE_FIGHTER: null,
	INGAME_REMOVE_FIGHTER: null,
	INGAME_RESET_PHASES: null,
	INGAME_RESET_HEALTH: null,
	INGAME_RESET_ALL: null,
	INGAME_UPDATE_ONLINE_LINK: null,
	INGAME_SAVE: null,
	INGAME_SWITCH_OPTION: null
});
