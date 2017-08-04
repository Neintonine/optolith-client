import * as React from 'react';

export interface ProgressBarOverlayProps {
	current: number;
	max: number;
	horizontal?: boolean;
}

export function ProgressBarOverlay(props: ProgressBarOverlayProps) {
	const { current, max, horizontal } = props;

	const style = horizontal ? { width: current / max } : { height: current / max };

	return (
		<div className="progressbar-overlay" style={style}></div>
	);
}