import AttributeStore from '../../../stores/AttributeStore';
import APStore from '../../../stores/APStore';
import Avatar from '../../layout/Avatar';
import Box from '../../layout/sheets/Box';
import CultureStore from '../../../stores/rcp/CultureStore';
import DisAdvStore from '../../../stores/DisAdvStore';
import ELStore from '../../../stores/ELStore';
import LabelBox from '../../layout/sheets/LabelBox';
import MainSheetCalcItem from './MainSheetCalcItem';
import OverviewDisAdv from './OverviewDisAdv';
import Plain from '../../layout/sheets/Plain';
import ProfessionStore from '../../../stores/rcp/ProfessionStore';
import ProfessionVariantStore from '../../../stores/rcp/ProfessionVariantStore';
import RaceStore from '../../../stores/rcp/RaceStore';
import React, { Component } from 'react';
import SheetHeader from './SheetHeader';
import TextBox from '../../layout/sheets/TextBox';

class SpellsSheet extends Component {

	constructor(props) {
		super(props);
	}

	render() {

		const addHeader = [
			{ short: 'AsP Max.', value: 0 },
			{ short: 'Aktuell' }
		];

		return (
			<div className="sheet spells">
				<SheetHeader title="Zauber & Rituale" add={addHeader} />
				<div className="upper">
					<TextBox label="Zauber & Rituale">
					</TextBox>
				</div>
			</div>
		);
	}
}

export default SpellsSheet;
