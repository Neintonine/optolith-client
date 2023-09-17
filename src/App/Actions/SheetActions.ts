import {
  SWITCH_SHEET_ATTR_VALUE_VISIBILITY,
  SWITCH_SHEET_USE_PARCHMENT,
  SET_SHEET_ZOOM_FACTOR,
  SET_SHEET_SHOW_RULES,
} from "../Constants/ActionTypes"

export interface SwitchSheetAttributeValueVisibilityAction {
  type: SWITCH_SHEET_ATTR_VALUE_VISIBILITY
}

export const switchAttributeValueVisibility = (): SwitchSheetAttributeValueVisibilityAction => ({
  type: SWITCH_SHEET_ATTR_VALUE_VISIBILITY,
})

export interface SwitchSheetUseParchmentAction {
  type: SWITCH_SHEET_USE_PARCHMENT
}

export const switchUseParchment = (): SwitchSheetUseParchmentAction => ({
  type: SWITCH_SHEET_USE_PARCHMENT,
})

export interface SetSheetShowRules {
  type: SET_SHEET_SHOW_RULES
  payload: {
    value: number
  }
}
export const setShowRules = (value: number): SetSheetShowRules => ({
  type: SET_SHEET_SHOW_RULES,
  payload: {
    value,
  },
})

export interface SetSheetZoomFactor {
  type: SET_SHEET_ZOOM_FACTOR
  payload: {
    zoomFactor: number
  }
}

export const setSheetZoomFactor = (zoomFactor: number): SetSheetZoomFactor => ({
  type: SET_SHEET_ZOOM_FACTOR,
  payload: {
    zoomFactor,
  },
})
