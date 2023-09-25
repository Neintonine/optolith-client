import * as React from "react"
import { List } from "../../../Data/List"
import { guardReplace, Just, Maybe } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"
import { isURLValidM } from "../../Utilities/RegexUtils"
import { Avatar } from "./Avatar"
import { IconButton } from "./IconButton"

interface Props {
  className?: string
  children?: React.ReactNode
  img?: boolean
  src: Maybe<string>
  onClick?: () => void
  editable?: boolean
  onDelete?: () => void
}

export const AvatarWrapper: React.FC<Props> = props => {
  const {
    children,
    img,
    onClick,
    src: msrc,
    editable,
    onDelete,
  } = props
  let { className } = props

  const validPath = isURLValidM (msrc)

  className = classListMaybe (List (
    Just ("avatar-wrapper"),
    guardReplace (!validPath) ("no-avatar"),
    guardReplace (editable ?? false) ("editable")
  ))

  const outerWrapper = [];

  if (onDelete !== undefined) {
    outerWrapper.push(
      (
        <IconButton
          className="delete-icon"
          icon="&#xE90b;"
          onClick={onDelete}
          disabled={!validPath}
        />
      )
    );
  }

  const avatar = (
    <div className={className} onClick={onClick}>
      {children}
      <Avatar
        img={img}
        src={msrc}
        hasWrapper
        validPath={validPath}
      />
    </div>
  );

  if (outerWrapper.length) {
    return (
      <div className="avatar-outer-wrapper">
        {avatar}
        {outerWrapper}
      </div>
    )
  }

  return avatar;
}
