import Dependent from './Dependent';
import { get } from '../../stores/ListStore';

export default class Activatable extends Dependent {
	
	constructor(args) {
		super(args);
		let { ap, input, max, req, sel, tiers, gr } = args;

		this.cost = ap;
		this.input = input;
		this.max = max;
		this.reqs = req;
		this.sel = sel;
		this.tiers = tiers;
		this.gr = gr;

		this.active = max === null ? false : [];
	}

	get isMultiselect() {
		return Array.isArray(this.active);
	}

	activate({ sel, sel2, input, tier }) {
		var adds = [];
		var new_sid;
		if (this.max !== null) {
			switch (this.id) {
				case 'ADV_4':
				case 'ADV_16':
				case 'DISADV_48':
					this.active.push(sel);
					new_sid = sel;
					break;
				case 'DISADV_1':
				case 'DISADV_34':
				case 'DISADV_50':
					if (input === '')
						this.active.push([sel, tier]);
					else if (this.active.filter(e => e[0] === input).length === 0)
						this.active.push([input, tier]);
					break;
				case 'DISADV_33':
					if ([7,8].includes(sel) && input !== '') {
						if (this.active.filter(e => e[1] === input).length === 0)
							this.active.push([sel, input]);
					} else
						this.active.push(sel);
					break;
				case 'DISADV_36':
					if (input === '')
						this.active.push(sel);
					else if (this.active.filter(e => e === input).length === 0)
						this.active.push(input);
					break;
				case 'SA_10':
					if (input === '') {
						this.active.push([sel, sel2]);
						adds.push([sel, this.active.filter(e => e[0] === sel).length * 6]);
					} else if (this.active.filter(e => e[0] === input).length === 0) {
						this.active.push([sel, input]);
						adds.push([sel, this.active.filter(e => e[0] === sel).length * 6]);
					}
					break;
				case 'SA_30':
					this.active.push([sel, tier]);
					break;
				default:
					if (sel)
						this.active.push(sel);
					else if (input && this.active.filter(e => e === input).length === 0)
						this.active.push(input);
					break;
			}
		} else {
			this.active = true;
			if (tier) {
				this.tier = tier;
			}
			if (sel) {
				if (this.input && input !== '' && input !== undefined) {
					this.sid = input;
				} else {
					this.sid = sel;
				}
			}
		}
		this.addDependencies(adds, new_sid);
	}

	deactivate({ sid, tier }) {
		var adds = [];
		var old_sid;
		if (this.max !== null) {
			switch (this.id) {
				case 'ADV_4':
				case 'ADV_16':
				case 'DISADV_48':
					this.active.splice(this.active.indexOf(sid), 1);
					old_sid = sid;
					break;
				case 'ADV_28':
				case 'ADV_29':
					if (typeof sid === 'number')
						this.active.splice(this.active.indexOf(sid), 1);
					else
						this.active = this.active.filter(e => e[0] !== sid);
					break;
				case 'DISADV_1':
				case 'DISADV_34':
				case 'DISADV_50':
					this.active = this.active.filter(e => e[0] !== sid);
					break;
				case 'DISADV_33':
					if (typeof sid === 'string') {
						let arr = sid.split('&');
						arr = [parseInt(arr.shift()), arr.join('&')];
						for (let i = 0; i < this.active.length; i++) {
							if (this.active[i][0] === arr[0] && this.active[i][1] === arr[1]) {
								this.active.splice(i, 1);
								break;
							}
						}
					} else {
						this.active.splice(this.active.indexOf(sid), 1);
					}
					break;
				case 'SA_10': {
					let arr = sid.split('&');
					arr = [arr.shift(), arr.join('&')];
					for (let i = 0; i < this.active.length; i++) {
						if (this.active[i][0] === arr[0] && (this.active[i][1] === arr[1] || this.active[i][1] === parseInt(arr[1]))) {
							adds.push([arr[0], this.active.filter(e => e[0] === arr[0]).length * 6]);
							this.active.splice(i, 1);
							break;
						}
					}
					break;
				}
				case 'SA_30':
					this.active = this.active.filter(e => e[0] !== sid);
					break;
				default:
					if (sid)
						this.active.splice(this.active.indexOf(sid), 1);
					break;
			}
		} else {
			this.active = false;
			if (tier) {
				delete this.tier;
			}
			if (this.sid) {
				delete this.sid;
			}
		}
		this.removeDependencies(adds, old_sid);
	}

	get tier() {
		return this.currentTier;
	}

	set tier(prop) {
		if (Number.isInteger(prop)) {
			this.currentTier = prop;
		}
		else {
			const { sid, tier } = prop;
			switch (this.id) {
				case 'DISADV_1':
				case 'SA_30':
					this.active.some(e => {
						if (e[0] === sid) {
							e[1] = tier;
							return true;
						}
						return false;
					});
					break;
				default:
					this.currentTier = tier;
					break;
			}
		}
	}

	addDependencies(adds = [], sel) {
		[].concat(this.reqs, adds).forEach(req => {
			let [ id, value, option ] = req;
			if (id === 'auto_req' || option === 'TAL_GR_2') {
				return;
			}
			if (id === 'ATTR_PRIMARY') {
				id = this.getPrimaryAttrID(option);
				get(id).addDependency(value);
			}
			else {
				let sid;
				if (typeof option !== 'undefined') {
					if (Number.isNaN(parseInt(option))) {
						if (option === 'sel') {
							sid = sel;
						} else {
							sid = option;
						}
					} else {
						sid = parseInt(option);
					}
				} else {
					sid = value;
				}
				get(id).addDependency(sid);
			}
		});
	}

	removeDependencies(adds, sel) {
		[].concat(this.reqs, adds).forEach(req => {
			let [ id, value, option ] = req;
			if (id === 'auto_req' || option === 'TAL_GR_2') {
				return;
			}
			if (id === 'ATTR_PRIMARY') {
				id = this.getPrimaryAttrID(option);
				get(id).removeDependency(value);
			}
			else {
				let sid;
				if (typeof option !== 'undefined') {
					if (Number.isNaN(parseInt(option))) {
						if (option === 'sel') {
							sid = sel;
						} else {
							sid = option;
						}
					} else {
						sid = parseInt(option);
					}
				} else {
					sid = value;
				}
				get(id).removeDependency(sid);
			}
		});
	}

	reset() {
		this.active = this.max === null ? false : [];
		delete this.sid;
		delete this.tier;
		this.dependencies = [];
	}
}
