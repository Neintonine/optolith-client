import React from "react"
import { fnullStr, List, notNullStr } from "../../../Data/List"
import { Just } from "../../../Data/Maybe"
import { EditPet } from "../../Models/Hero/EditPet"
import { Record } from "../../../Data/Record"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { classListMaybe } from "../../Utilities/CSS"
import { translate } from "../../Utilities/I18n"
import { AvatarChange } from "../Universal/AvatarChange"
import { AvatarWrapper } from "../Universal/AvatarWrapper"
import { EditableText } from "../Universal/EditableText"
import { IconButton } from "../Universal/IconButton"
import { TextField } from "../Universal/TextField"

const EPA = EditPet.A

interface PetEditorGeneralProps {
  staticData: StaticDataRecord

  pet: Record<EditPet>
  isEditPetAvatarOpen: boolean

  openEditPetAvatar (): void
  closeEditPetAvatar (): void

  setAvatar (path: string): void
  deleteAvatar (): void
  setName (name: string): void
  setSize (size: string): void
  setType (type: string): void
  setSpentAp (spentAp: string): void
  setTotalAp (totalAp: string): void
}

interface APEditorProps {
  spentAp: string
  totalAp: string

  setSpentAp (spentAp: string): void
  setTotalAp (totalAp: string): void
}

const APEditor: React.FC<APEditorProps> = props => {
  const {
    spentAp,
    setSpentAp,

    totalAp,
    setTotalAp,
  } = props

  const [ isEditing, setIsEditing ] = React.useState<boolean> (false)

  const [ spentApEdit, setSpentApEdit ] = React.useState<string> (spentAp)
  const [ totalApEdit, setTotalApEdit ] = React.useState<string> (spentAp)

  const handleEdit = React.useCallback (
    () => setIsEditing (true),
    [ setIsEditing ]
  )

  const handleSubmit = React.useCallback (
    () => {
      if (notNullStr (spentApEdit)) {
        setSpentAp (spentApEdit)
      }
      if (notNullStr (totalApEdit)) {
        setTotalAp (totalApEdit)
      }

      setIsEditing (false)
    },
    [ spentApEdit, totalApEdit, setSpentAp, setTotalAp, setIsEditing ]
  )
  const handleCancel = React.useCallback (
    () => {
      setIsEditing (false)
    },
    [ setIsEditing ]
  )

  if (isEditing) {
    return (
      <div
        className={
          classListMaybe (List (
            Just ("confirm-edit")
          ))
        }
        >
        {
          [
            (
              <TextField
                type="number"
                className="ap-entry"
                value={spentApEdit}
                onChange={setSpentApEdit}
                autoFocus
                />
            ),
            (
              <span style={{ marginRight: ".2rem", marginLeft: ".2rem" }}>
                {"/"}
              </span>
            ),
            (
              <TextField
                type="number"
                className="ap-entry"
                value={totalApEdit}
                onChange={setTotalApEdit}
                />
            ),
          ]
        }


        <IconButton
          icon="&#xE90a;"
          onClick={handleSubmit}
          disabled={fnullStr (spentApEdit) || fnullStr (totalApEdit)}
          />
        <IconButton
          icon="&#xE915;"
          onClick={handleCancel}
          />
      </div>
    )
  }

  return (
    <span className="confirm-edit">
      {
        [
          spentAp,
          (
            <span style={{ marginRight: ".2rem", marginLeft: ".2rem" }}>
              {"/"}
            </span>
          ),
          totalAp,
        ]
      }

      <IconButton
        flat icon="&#xE90c;"
        onClick={handleEdit}
        />
    </span>
  )
}

export const PetEditorGeneral: React.FC<PetEditorGeneralProps> = props => {
  const {
    staticData,

    pet,
    isEditPetAvatarOpen,

    openEditPetAvatar,
    closeEditPetAvatar,

    setAvatar,
    deleteAvatar,
    setName,
    setSize,
    setType,
    setSpentAp,
    setTotalAp,
  } = props

  const name = EPA.name (pet)
  const type = EPA.type (pet)

  const spentAp = EPA.spentAp (pet)
  const totalAp = EPA.totalAp (pet)

  const getNameDisplay = React.useCallback (
    startAction => (
        <h1 className="confirm-edit">
          {
            name === ""
              ? (
                <i>
                  {translate (staticData) ("pets.dialogs.addedit.name")}
                </i>
              )
              : name
          }
          <IconButton icon="&#xE90c;" onClick={startAction} />
        </h1>
      ),
    [ name, staticData ]
  )

  return (
    <div id="pet-editor-general" className="pet-editor-part">
      <div className="text">
        <div className="title-wrapper">
          <AvatarWrapper
            src={EPA.avatar (pet)}
            onClick={openEditPetAvatar}
            onDelete={deleteAvatar}
            editable
            />
          <div className="text-wrapper">
            <EditableText
              value={name}
              setValue={setName}
              displayValue={getNameDisplay}
              />
            <div>
              <span className="confirm-edit">
                <span className="caption">
                  {translate (staticData) ("pets.dialogs.addedit.type")}
                  {":"}
                </span>

                <EditableText
                  value={type}
                  setValue={setType}
                  />
              </span>
              <span className="confirm-edit">
                <span className="caption">
                  {translate (staticData) ("pets.dialogs.addedit.sizecategory")}
                  {": "}
                </span>

                <EditableText
                  value={EPA.size (pet)}
                  setValue={setSize}
                  />
              </span>
              <span className="confirm-edit">
                <span className="caption">
                  {"AP:"}
                </span>

                <APEditor
                  spentAp={spentAp === "" ? "0" : spentAp}
                  totalAp={totalAp === "" ? "0" : totalAp}
                  setSpentAp={setSpentAp}
                  setTotalAp={setTotalAp}
                  />
              </span>
            </div>
          </div>
        </div>
      </div>
      <AvatarChange
        staticData={staticData}
        setPath={setAvatar}
        close={closeEditPetAvatar}
        isOpen={isEditPetAvatarOpen}
        />
    </div>
  )
}
