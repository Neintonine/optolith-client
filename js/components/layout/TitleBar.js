import APStore from '../../stores/APStore';
import Avatar from './Avatar';
import BorderButton from './BorderButton';
import IconButton from './IconButton';
import PhaseActions from '../../actions/PhaseActions';
import PhaseStore from '../../stores/PhaseStore';
import ProfileStore from '../../stores/ProfileStore';
import React, { Component, PropTypes } from 'react';
import Tab from './Tab';
import TabActions from '../../actions/TabActions';
import TitleBarArrow from './TitleBarArrow';
import TitleBarNav from './TitleBarNav';

class PageTab extends Component {

	static propTypes = {
		active: PropTypes.bool.isRequired,
		className: PropTypes.any,
		disabled: PropTypes.bool,
		label: PropTypes.string,
		tag: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);
	}

	handleClick = tab => TabActions.openTab(tab);

	render() {

		const { tag, ...other } = this.props;

		return (
			<Tab {...other} onClick={this.handleClick.bind(null, tag)} />
		);
	}
}

class TitleBar extends Component {

	static propTypes = {
		section: PropTypes.string.isRequired,
		tab: PropTypes.string.isRequired
	};

	state = {
		ap: APStore.get(),
		used: APStore.getUsed(),
		disadv: APStore.getForDisAdv(),
		phase: PhaseStore.get(),
		portrait: ProfileStore.getPortrait()
	};

	constructor(props) {
		super(props);
	}

	_updateAPStore = () => this.setState({ ap: APStore.get(), used: APStore.getUsed(), disadv: APStore.getForDisAdv() });
	_updatePhaseStore = () => this.setState({ phase: PhaseStore.get() });
	_updateProfileStore = () => this.setState({ portrait: ProfileStore.getPortrait() });

	componentDidMount() {
		APStore.addChangeListener(this._updateAPStore);
		PhaseStore.addChangeListener(this._updatePhaseStore);
		ProfileStore.addChangeListener(this._updateProfileStore);
	}

	componentWillUnmount() {
		APStore.removeChangeListener(this._updateAPStore);
		PhaseStore.removeChangeListener(this._updatePhaseStore);
		ProfileStore.removeChangeListener(this._updateProfileStore);
	}

	increasePhase = () => PhaseActions.increasePhase();
	resetPhase = () => PhaseActions.resetPhase();
	back = () => TabActions.showSection('main');

	render() {

		const { section, tab } = this.props;
		const { ap, used, phase, portrait } = this.state;

		var showBackNav = true;
		var tabsElement;
		var actionsElement;

		switch (section) {
			case 'main': {
				showBackNav = false;
				tabsElement = (
					<TitleBarNav active={tab} tabs={[
						{ label: 'Startseite', tag: 'home', disabled: true },
						{ label: 'Konto', tag: 'account', disabled: true },
						{ label: 'Helden', tag: 'herolist' },
						{ label: 'Gruppen', tag: 'grouplist' },
						{ label: 'Über', tag: 'about' }
					]} />
				);

				actionsElement = (
					<div className="right">
						<IconButton icon="&#xE8B8;" disabled />
						<BorderButton label="Abmelden" disabled />
					</div>
				);
				break;
			}
			case 'hero': {
				var phaseElement;

				switch (phase) {
					case 1:
						tabsElement = (
							<TitleBarNav active={tab} avatar={portrait} tabs={[
								{ label: 'Profil', tag: 'profile' },
								{ label: 'Spezies, Kultur & Profession', tag: 'rcp' }
							]} />
						);
						phaseElement = <IconButton icon="&#xE044;" primary onClick={this.increasePhase} />;
						break;
					case 2:
						tabsElement = (
							<TitleBarNav active={tab} avatar={portrait} tabs={[
								{ label: 'Profil', tag: 'profile' },
								{ label: 'Eigenschaften', tag: 'attributes' },
								{ label: 'Vorteile & Nachteile', tag: 'disadv' },
								{ label: 'Fertigkeiten', tag: 'skills' }
							]} />
						);
						phaseElement = <IconButton icon="&#xE044;" primary onClick={this.increasePhase} />;
						break;
					case 3:
						tabsElement = (
							<TitleBarNav active={tab} avatar={portrait} tabs={[
								{ label: 'Profil', tag: 'profile' },
								{ label: 'Eigenschaften', tag: 'attributes' },
								{ label: 'Fertigkeiten', tag: 'skills' },
								{ label: 'Gegenstände', tag: 'items', disabled: true }
							]} />
						);
						phaseElement = <IconButton icon="&#xE044;" primary onClick={this.increasePhase} />;
						break;
					case 4:
						tabsElement = (
							<TitleBarNav active={tab} avatar={portrait} tabs={[
								{ label: 'Profile', tag: 'profile' },
								{ label: 'RCP', tag: 'rcp' },
								{ label: 'Attributes', tag: 'attributes' },
								{ label: 'Adv & Disadv', tag: 'disadv' },
								{ label: 'Skills', tag: 'skills' },
								{ label: 'Items', tag: 'items', disabled: true }
							]} />
						);
						phaseElement = <IconButton icon="&#xE8B3;" primary onClick={this.resetPhase} />;
						break;
				}

				actionsElement = (
					<div className="right">
						<div className="ap">{ap - used} AP</div>
						<IconButton icon="&#xE166;" disabled />
						<BorderButton label="Speichern" disabled />
						{phaseElement}
					</div>
				);
				break;
			}
			case 'group': {
				tabsElement = (
					<div className="left">
						<h1 className="group-name">Gruppenname</h1>
					</div>
				);

				actionsElement = (
					<div className="right">
						<BorderButton label="Speichern" disabled />
					</div>
				);
				break;
			}
		}

		const backElement = showBackNav ? (
			<div className="back">
				<TitleBarArrow onClick={this.back} />
			</div>
		) : null;

		return (
			<div className="titlebar">
				<div className="main">
					{backElement}
					{tabsElement}
					{actionsElement}
				</div>
			</div>
		);
	}
}
						// <div className="details">
						// 	<div className="all"><span>{this.state.ap}</span> AP gesamt</div>
						// 	<div className="used"><span>{this.state.used}</span> AP verwendet</div>
						// 	<hr />
						// 	<div className="adv">
						// 		<span>{this.state.disadv.adv[0]} / 80</span> AP für Vorteile
						// 		{this.state.disadv.adv[1] > 0 ? ` (davon ${this.state.disadv.adv[1]} für magische)`:null}
						// 		{this.state.disadv.adv[2] > 0 ? ` (davon ${this.state.disadv.adv[2]} für karmale)`:null}
						// 	</div>
						// 	<div className="disadv">
						// 		<span>{this.state.disadv.disadv[0]} / 80</span> AP für Nachteile
						// 		{this.state.disadv.disadv[1] > 0 ? `(davon ${this.state.disadv.disadv[1]} für magische)`:null}
						// 		{this.state.disadv.disadv[2] > 0 ? `(davon ${this.state.disadv.disadv[2]} für karmale)`:null}
						// 	</div>
						// </div>

export default TitleBar;
