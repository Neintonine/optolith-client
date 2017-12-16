import { remote } from 'electron';
import * as React from 'react';
import { BorderButton } from '../../components/BorderButton';
import { IconButton } from '../../components/IconButton';
import { Text } from '../../components/Text';
import { SettingsContainer } from '../../containers/Settings';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';
import { TabId } from '../../utils/LocationUtils';
import { NavigationBarBack } from './NavigationBarBack';
import { NavigationBarLeft } from './NavigationBarLeft';
import { NavigationBarRight } from './NavigationBarRight';
import { NavigationBarWrapper } from './NavigationBarWrapper';

export interface NavigationBarForGroupProps {
	locale: UIMessages;
	groupName: string;
	platform: string;
	isSettingsOpen: boolean;
	closeSettings(): void;
	openSettings(): void;
	saveGroup(): void;
	setTab(id: TabId): void;
	checkForUpdates(): void;
}

export function NavigationBarForGroup(props: NavigationBarForGroupProps) {
	const { closeSettings, groupName, locale, openSettings, saveGroup, setTab } = props;
	return (
		<NavigationBarWrapper>
			<NavigationBarLeft>
				<NavigationBarBack setTab={() => setTab('grouplist')} />
				<Text>{groupName}</Text>
			</NavigationBarLeft>
			<NavigationBarRight>
				<BorderButton
					label={_translate(locale, 'actions.save')}
					onClick={saveGroup}
					/>
				<IconButton
					icon="&#xE906;"
					onClick={openSettings}
					/>
				<SettingsContainer {...props} close={closeSettings} />
				<IconButton
					icon="&#xE911;"
					onClick={toggleDevtools}
					/>
			</NavigationBarRight>
		</NavigationBarWrapper>
	);
}

function toggleDevtools() {
	remote.getCurrentWindow().webContents.toggleDevTools();
}
