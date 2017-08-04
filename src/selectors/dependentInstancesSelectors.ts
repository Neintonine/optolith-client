import { createSelector } from 'reselect';
import { Category, CategoryWithGroups } from '../constants/Categories';
import { AppState } from '../reducers/app';
import { DependentInstancesState } from '../reducers/dependentInstances';
import { InstanceByCategory, ToOptionalKeys } from '../types/data.d';
import { getStateKeyByCategory, getStateKeyById } from '../utils/IDUtils';

export const getDependent = (state: AppState) => state.currentHero.present.dependent;

export function get(state: ToOptionalKeys<DependentInstancesState>, id: string) {
	const key = getStateKeyById(id);
	const slice = key && state[key];
	return slice && slice.get(id);
}

export const makeGet = createSelector(
	[ getDependent ],
	dependent => (id: string) => get(dependent, id)
);

export function getFromArray<T extends { id: string; [key: string]: any; }>(array: T[], id: string) {
	return array.find(e => e.id === id);
}

export function getx(state: AppState) {
	return (id: string) => get(getDependent(state), id);
}

export function getLatest(state: DependentInstancesState, newstate: ToOptionalKeys<DependentInstancesState>, id: string) {
	return get(newstate, id) || get(state, id);
}

export function getAllByCategory<T extends Category>(state: DependentInstancesState, ...categories: T[]) {
	return categories.reduce<InstanceByCategory[T][]>((arr, e) => {
		const key = getStateKeyByCategory(e);
		if (key) {
			return [...arr, ...state[key].values()] as InstanceByCategory[T][];
		}
		return arr;
	}, []);
}

export function getAllByCategoryGroup<T extends CategoryWithGroups>(state: DependentInstancesState, category: T, ...gr: number[]) {
	const key = getStateKeyByCategory(category)!;
	return ([...state[key].values()] as InstanceByCategory[T][]).filter(e => gr.includes(e.gr));
}

export function getMapByCategory<T extends Category>(state: DependentInstancesState, ...categories: T[]) {
	return categories.reduce<Map<string, InstanceByCategory[T]>>((arr, e) => {
		const key = getStateKeyByCategory(e);
		if (key) {
			return new Map([...arr, ...state[key]]) as Map<string, InstanceByCategory[T]>;
		}
		return arr;
	}, new Map());
}