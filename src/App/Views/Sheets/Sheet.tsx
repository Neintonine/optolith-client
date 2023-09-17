import * as React from "react"
import { List } from "../../../Data/List"
import { Record } from "../../../Data/Record"
import { AttributeCombined } from "../../Models/View/AttributeCombined"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { SheetBackground } from "./SheetBackgroundDropdown"
import { HeaderValue, SheetHeader } from "./SheetHeader"

export interface SheetProps {
  addHeaderInfo?: List<Record<HeaderValue>>
  attributes: List<Record<AttributeCombined>>
  id: string
  staticData: StaticDataRecord
  title: string
  background: SheetBackground
}

export const Sheet: React.FC<SheetProps> = props => {
  const {
    addHeaderInfo,
    attributes,
    children,
    id,
    staticData,
    title,
    background,
  } = props

  const image = background.getElement ()
  const className = image === null ? "sheet" : "sheet paper"

  return (
    <div className={className} id={id}>
      <SheetHeader
        title={title}
        add={addHeaderInfo}
        attributes={attributes}
        staticData={staticData}
        />
      {children}
      {image}
    </div>
  )
}
