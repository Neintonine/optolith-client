import { connect } from 'react-redux';
import { AppState } from '../reducers/app';
import { getDependentInstances, getSex, getWiki, getWikiAttributes, getWikiBooks, getWikiCantrips, getWikiCombatTechniques, getWikiItemTemplates, getWikiLiturgicalChants, getWikiRaces, getWikiSkills, getWikiSpecialAbilities, getWikiSpells } from '../selectors/stateSelectors';
import { getAllWikiEntries } from '../selectors/wikiSelectors';
import { getDerivedCharacteristicsMap } from '../utils/derivedCharacteristics';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { WikiInfo, WikiInfoDispatchProps, WikiInfoOwnProps, WikiInfoStateProps } from '../views/wiki/WikiInfo';

function mapStateToProps(state: AppState) {
	return {
		attributes: getWikiAttributes(state),
		books: getWikiBooks(state),
		cantrips: getWikiCantrips(state),
		combatTechniques: getWikiCombatTechniques(state),
		derivedCharacteristics: getDerivedCharacteristicsMap(state),
		dependent: getDependentInstances(state),
		languages: mapGetToSlice(getWikiSpecialAbilities, 'SA_29')(state)!,
		list: getAllWikiEntries(state),
		races: getWikiRaces(state),
		liturgicalChantExtensions: mapGetToSlice(getWikiSpecialAbilities, 'SA_663')(state),
		liturgicalChants: getWikiLiturgicalChants(state),
		scripts: mapGetToSlice(getWikiSpecialAbilities, 'SA_27')(state)!,
		sex: getSex(state),
		skills: getWikiSkills(state),
		spellExtensions: mapGetToSlice(getWikiSpecialAbilities, 'SA_414')(state),
		spells: getWikiSpells(state),
		specialAbilities: getWikiSpecialAbilities(state),
		templates: getWikiItemTemplates(state),
		wiki: getWiki(state),
	};
}

export const WikiInfoContainer = connect<WikiInfoStateProps, WikiInfoDispatchProps, WikiInfoOwnProps>(mapStateToProps)(WikiInfo);
