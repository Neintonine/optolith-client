import * as React from "react"
import { equals } from "../../../../Data/Eq"
import { fmap, fmapF } from "../../../../Data/Functor"
import { find, flength, List, splitAt } from "../../../../Data/List"
import { fromMaybe, Just, Maybe } from "../../../../Data/Maybe"
import { divideBy, max, multiply } from "../../../../Data/Num"
import { Record } from "../../../../Data/Record"
import { fst, Pair, snd } from "../../../../Data/Tuple"
import { AttrId } from "../../../Constants/Ids"
import { Purse } from "../../../Models/Hero/Purse"
import { AttributeCombined, AttributeCombinedA_ } from "../../../Models/View/AttributeCombined"
import { ItemForView } from "../../../Models/View/ItemForView"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { localizeNumber, localizeWeight, translate } from "../../../Utilities/I18n"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { renderMaybe } from "../../../Utilities/ReactUtils"
import { LabelBox } from "../../Universal/LabelBox"
import { TextBox } from "../../Universal/TextBox"
import { Sheet } from "../Sheet"
import { SheetBackground } from "../SheetBackgroundDropdown"
import { SheetWrapper } from "../SheetWrapper"
import { BelongingsSheetItemsColumn } from "./BelongingsSheetItemsColumn"
import { BelongingsSheetPurse } from "./BelongingsSheetPurse"

interface Props {
  attributes: List<Record<AttributeCombined>>
  items: Maybe<List<Record<ItemForView>>>
  staticData: StaticDataRecord
  purse: Maybe<Record<Purse>>
  totalPrice: Maybe<number>
  totalWeight: Maybe<number>
  background: SheetBackground
}

export const BelongingsSheet: React.FC<Props> = props => {
  const {
    attributes,
    items: mitems,
    staticData,
    purse,
    totalPrice: maybeTotalPrice,
    totalWeight: maybeTotalWeight,
    background,
  } = props

  const strength =
    pipe_ (
      attributes,
      find (pipe (AttributeCombinedA_.id, equals<string> (AttrId.Strength))),
      fmap (AttributeCombinedA_.value),
      Maybe.sum
    )

  const columnSize =
    pipe_ (
      mitems,
      fmap (pipe (
        flength,
        divideBy (2),
        Math.round,
        max (33)
      )),
      fromMaybe (33)
    )

  const maybeColumns = fmapF (mitems) (splitAt (columnSize))

  return (
    <SheetWrapper>
      <Sheet
        id="belongings"
        title={translate (staticData) ("sheets.belongingssheet.title")}
        attributes={attributes}
        staticData={staticData}
        background={background}
        >
        <div className="upper">
          <TextBox
            label={translate (staticData) ("sheets.belongingssheet.equipmenttable.title")}
            className="equipment"
            >
            {pipe_ (
              maybeColumns,
              fmap ((columns: Pair<List<Record<ItemForView>>, List<Record<ItemForView>>>) => (
                <div>
                  <BelongingsSheetItemsColumn
                    items={fst (columns)}
                    columnSize={columnSize}
                    staticData={staticData}
                    />
                  <BelongingsSheetItemsColumn
                    items={snd (columns)}
                    columnSize={columnSize}
                    staticData={staticData}
                    />
                </div>
              )),
              fromMaybe (<div />)
            )}
            <div className="total">
              <label>
                {translate (staticData) ("sheets.belongingssheet.equipmenttable.labels.total")}
              </label>
              <span>
                {pipe_ (
                  maybeTotalPrice,
                  fmap (pipe (
                    multiply (100),
                    Math.round,
                    divideBy (100),
                    localizeNumber (staticData)
                  )),
                  renderMaybe
                )}
              </span>
              <span>
                {pipe_ (
                  maybeTotalWeight,
                  fmap (pipe (
                    multiply (100),
                    Math.round,
                    divideBy (100),
                    localizeWeight (staticData),
                    localizeNumber (staticData)
                  )),
                  renderMaybe
                )}
              </span>
              <div className="fill" />
              <div className="carrying-capacity">
                <div className="left">
                  <h3>
                    {translate
                        (staticData)
                        ("sheets.belongingssheet.carryingcapacity.title")}
                  </h3>
                  <p>{translate (staticData) ("sheets.belongingssheet.carryingcapacity.calc")}</p>
                </div>
                <LabelBox
                  label={translate (staticData) ("sheets.belongingssheet.carryingcapacity.label")}
                  value={Just (localizeWeight (staticData) (strength * 2))}
                  />
              </div>
            </div>
          </TextBox>
        </div>
        <BelongingsSheetPurse
          staticData={staticData}
          purse={purse}
          items={mitems}
          />
      </Sheet>
    </SheetWrapper>
  )
}
