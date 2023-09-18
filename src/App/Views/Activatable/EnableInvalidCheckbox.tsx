import * as React from "react"
import { Maybe } from "../../../Data/Maybe"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { Checkbox } from "../Universal/Checkbox"

interface EnableInvalidCheckboxProps {
  staticData: StaticDataRecord
  checked: boolean | Maybe<boolean>
  disabled?: boolean
  onClick (): void

}

export const EnableInvalidCheckbox: React.FC<EnableInvalidCheckboxProps> = props => {
  const {
    staticData,
    checked,
    disabled,
    onClick,
  } = props

  return (
      <div>
        <Checkbox
          checked={checked}
          onClick={onClick}
          disabled={disabled}
          >
          {translate (staticData) ("general.filters.showinvalidentries")}
        </Checkbox>

        <span>
          {translate (staticData) ("general.filters.showinvalidentries.warning")}
        </span>
      </div>
  )
}
