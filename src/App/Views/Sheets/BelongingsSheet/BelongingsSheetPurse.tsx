import React from "react"
import { equals } from "../../../../Data/Eq"
import { fmapF } from "../../../../Data/Functor"
import { filter, intercalate, List, map, replicateR } from "../../../../Data/List"
import { fromJust, isNothing, Maybe, Nothing } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { Purse } from "../../../Models/Hero/Purse"
import { ItemForView } from "../../../Models/View/ItemForView"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { toIntTypeSafe } from "../../../Utilities/NumberUtils"
import { pipe } from "../../../Utilities/pipe"
import { LabelBox } from "../../Universal/LabelBox"

interface BelongingsSheetPurseProps {
  staticData: StaticDataRecord
  purse: Maybe<Record<Purse>>
  items: Maybe<List<Record<ItemForView>>>
}

const TD_AMOUNT = 9

const createTD = (key: string, fill: number, currentValue: string) => {
  const intValue = toIntTypeSafe (currentValue)
  const insertedValuesCount = TD_AMOUNT - fill

  let currentIntValue = intValue
  const insertedValues: any[] = []
  let foundFirstNumber = false
  for (let i = (insertedValuesCount - 1); i >= 0; i--) {
    const divider = Math.pow (10, i)
    const currentValAtIndex = Math.floor (currentIntValue / divider)
    const rest = currentIntValue % divider

    currentIntValue = rest

    if (!foundFirstNumber && currentValAtIndex === 0) {
      insertedValues.push (null)
      continue
    }

    foundFirstNumber = true

    insertedValues.push (currentValAtIndex)
  }

  return replicateR
    (TD_AMOUNT)
    (index => {
      const threshold = TD_AMOUNT - fill
      const value = (() => {
        if (threshold <= index) {
          return "X"
        }

        const val = insertedValues[index]

        if (val === null) {
          return ""
        }

        return val.toString ()
      }) ()


      return (
        <td className="value-bearer" key={`money-value-${key}-${index}`}>
          <span>{value}</span>
        </td>
      )
    })
}

export const BelongingsSheetPurse: React.FC<BelongingsSheetPurseProps> = props => {
  const {
    staticData,
    purse,
    items,
  } = props

  if (isNothing (purse)) {
    return null
  }

  const jPurse = fromJust (purse)

  return (
    <div className="purse">
        <div className="valuables-container">
          <div className="money">
            <label>{translate (staticData) ("sheets.belongingssheet.purse.title")}</label>
            <table className="money-table">
              <tbody>
              <tr>
                <td className="money-name">
                  {translate (staticData) ("sheets.belongingssheet.purse.ducats")}
                </td>
                {createTD ("ducats", 3, Purse.A.d (jPurse))}
              </tr>
              <tr>
                <td className="money-name">
                  {translate (staticData) ("sheets.belongingssheet.purse.silverthalers")}
                </td>
                {createTD ("silverthalers", 2, Purse.A.s (jPurse))}
              </tr>
              <tr>
                <td className="money-name">
                  {translate (staticData) ("sheets.belongingssheet.purse.halers")}
                </td>
                {createTD ("halers", 1, Purse.A.h (jPurse))}
              </tr>
              <tr>
                <td className="money-name">
                  {translate (staticData) ("sheets.belongingssheet.purse.kreutzers")}
                </td>
                {createTD ("kreutzers", 0, Purse.A.k (jPurse))}
              </tr>
              </tbody>
            </table>
          </div>


          <LabelBox
            className="specifics"
            label={translate (staticData) ("sheets.belongingssheet.purse.gems")}
            value={fmapF (items)
            (pipe (
              filter (pipe (ItemForView.A.gr, equals (16))),
              map (ItemForView.A.name),
              intercalate (", ")
            ))}
          />
          <LabelBox
            className="specifics"
            label={translate (staticData) ("sheets.belongingssheet.purse.jewelry")}
            value={fmapF (items)
            (pipe (
              filter (pipe (ItemForView.A.gr, equals (15))),
              map (ItemForView.A.name),
              intercalate (", ")
            ))}
          />
          <LabelBox
            className="specifics"
            label={translate (staticData) ("sheets.belongingssheet.purse.other")}
            value={Nothing}
          />
        </div>
    </div>
  )
}
