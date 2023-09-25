import React from "react"
import { EditText } from "./EditText"
import { IconButton } from "./IconButton"

interface EditableTextProps {
  value: string
  displayValue?: (startAction: () => void) => JSX.Element

  setValue (newValue: string): void
}

export const EditableText: React.FC<EditableTextProps> = props => {
  const {
    value,
    setValue,
  } = props
  let { displayValue } = props

  const [ isEditing, setIsEditing ] = React.useState<boolean> ()

  const handleEdit = React.useCallback (
    (new_name: string) => {
      setValue (new_name)
      setIsEditing (false)
    },
    [ setIsEditing, setValue ]
  )

  const handleStartEdit = React.useCallback (
    () => setIsEditing (true),
    [ setIsEditing ]
  )

  const handleCancelEdit = React.useCallback (
    () => setIsEditing (false),
    [ setIsEditing ]
  )

  displayValue ??= startAction => (
    <span className="confirm-edit">
      {value}

      <IconButton flat icon="&#xE90c;" onClick={startAction} />
    </span>
  )

  if (isEditing) {
    return (
      <span className="confirm-edit">
        <EditText
          className="change-input"
          cancel={handleCancelEdit}
          submit={handleEdit}
          text={value}
          autoFocus
          />
      </span>
    )
  }

  return displayValue (handleStartEdit)
}
