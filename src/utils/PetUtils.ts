import { PetEditorInstance, PetInstance } from '../types/data.d';

export function convertToEdit(item: PetInstance): PetEditorInstance {
	return {
		...item,
		size: item.size || '',
		type: item.type || '',
		attack: item.attack || '',
		dp: item.dp || '',
		reach: item.reach || '',
		actions: item.actions || '',
		talents: item.talents || '',
		skills: item.skills || '',
		notes: item.notes || '',
		spentAp: item.spentAp || '',
		totalAp: item.totalAp || '',
		cou: item.cou || '',
		sgc: item.sgc || '',
		int: item.int || '',
		cha: item.cha || '',
		dex: item.dex || '',
		agi: item.agi || '',
		con: item.con || '',
		str: item.str || '',
		lp: item.lp || '',
		ae: item.ae || '',
		spi: item.spi || '',
		tou: item.tou || '',
		pro: item.pro || '',
		ini: item.ini || '',
		mov: item.mov || '',
		at: item.at || '',
		pa: item.pa || ''
	};
}

export function getNewInstance(): PetEditorInstance {
	return {
		name: '',
		size: '',
		type: '',
		avatar: '',
		attack: '',
		dp: '',
		reach: '',
		actions: '',
		talents: '',
		skills: '',
		spentAp: '',
		totalAp: '',
		cou: '',
		sgc: '',
		int: '',
		cha: '',
		dex: '',
		agi: '',
		con: '',
		str: '',
		lp: '',
		ae: '',
		spi: '',
		tou: '',
		pro: '',
		ini: '',
		mov: '',
		at: '',
		pa: '',
		notes: ''
	};
}

export function convertToSave(item: PetEditorInstance): PetInstance {
	return {
		...item,
		size: item.size.length > 0 ? item.size : undefined,
		type: item.type.length > 0 ? item.type : undefined,
		attack: item.attack.length > 0 ? item.attack : undefined,
		dp: item.dp.length > 0 ? item.dp : undefined,
		reach: item.reach.length > 0 ? item.reach : undefined,
		actions: item.actions.length > 0 ? item.actions : undefined,
		talents: item.talents.length > 0 ? item.talents : undefined,
		skills: item.skills.length > 0 ? item.skills : undefined,
		notes: item.notes.length > 0 ? item.notes : undefined,
		spentAp: item.spentAp.length > 0 ? item.spentAp : undefined,
		totalAp: item.totalAp.length > 0 ? item.totalAp : undefined,
		cou: item.cou.length > 0 ? item.cou : undefined,
		sgc: item.sgc.length > 0 ? item.sgc : undefined,
		int: item.int.length > 0 ? item.int : undefined,
		cha: item.cha.length > 0 ? item.cha : undefined,
		dex: item.dex.length > 0 ? item.dex : undefined,
		agi: item.agi.length > 0 ? item.agi : undefined,
		con: item.con.length > 0 ? item.con : undefined,
		str: item.str.length > 0 ? item.str : undefined,
		lp: item.lp.length > 0 ? item.lp : undefined,
		ae: item.ae.length > 0 ? item.ae : undefined,
		spi: item.spi.length > 0 ? item.spi : undefined,
		tou: item.tou.length > 0 ? item.tou : undefined,
		pro: item.pro.length > 0 ? item.pro : undefined,
		ini: item.ini.length > 0 ? item.ini : undefined,
		mov: item.mov.length > 0 ? item.mov : undefined,
		at: item.at.length > 0 ? item.at : undefined,
		pa: item.pa.length > 0 ? item.pa : undefined
	};
}
