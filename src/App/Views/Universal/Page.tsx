import * as React from "react"
import { List } from "../../../Data/List"
import { guardReplace, Just } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"

interface Props {
  id?: string
  vertical?: boolean
}

export const Page: React.FC<Props> = props => {
  const { children, id, vertical } = props

  const className = classListMaybe (List (
    Just ("page"),
    guardReplace (vertical ?? false) ("vertical"),
  ))

  return (
    <div className={className} id={id}>
      {children}
    </div>
  )
}
