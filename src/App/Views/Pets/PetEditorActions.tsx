import React from "react"
import { Record } from "../../../Data/Record"
import { EditPet } from "../../Models/Hero/EditPet"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { IconButton } from "../Universal/IconButton"
import { TextField } from "../Universal/TextField"

const EPA = EditPet.A

interface Props {
  staticData: StaticDataRecord
  pet: Record<EditPet>

  setActions (actions: string): void
  setSkills (skills: string): void
  setSpecialAbility (abilities: string): void
}

interface ActionListProps {
  name: string
  abilities: string[]
  updated: (abilities: string[]) => void
}

function useForceUpdate () {
  const [ _, setValue ] = React.useState (0)

  return () => setValue (value => value + 1)
}

const ActionList: React.FC<ActionListProps> = props => {
  const {
    abilities,
    updated,
    name,
  } = props

  const abilityMarkdown = abilities.map ((value, index) => {
    // @ts-ignore
    const change = newValue => {
        abilities[index] = newValue

        updated (abilities)
      }

    const remove =
      () => {
        abilities.splice (index, 1)
        updated (abilities)
      }

    return (
      <div className="list-item">
        <TextField
          onChange={change}
          value={value}
          />
        <IconButton
          className="remove"
          icon="&#xE909;"
          flat
          onClick={remove}
          disabled={abilities.length < 2}
          />
      </div>
    )
  })

  const handleAdd = React.useCallback (
    () => {
      abilities.push ("")
      updated (abilities)
    },
    []
  )

  return (
    <div className="list">
      <div className="title">
        <span>{name}</span>
        <IconButton
          className="add"
          icon="&#xE908;"
          flat
          onClick={handleAdd}
          />
      </div>
      {abilityMarkdown}
    </div>
  )
}

export const PetEditorActions: React.FC<Props> = props => {
  const {
    staticData,
    pet,
    setSpecialAbility,
    setActions,
    setSkills,
  } = props

  const actions = EPA.actions (pet).split (", ")
  const currentTalents = EPA.talents (pet).split (", ")
  const currentSkills = EPA.skills (pet).split (", ")

  const [ abilities, setAbilties ] = React.useState<string[]> (actions)
  const [ talents, setTalents ] = React.useState<string[]> (currentTalents)
  const [ specialAbilities, setSpecialAbilities ] = React.useState<string[]> (currentSkills)
  const forceUpdate = useForceUpdate ()

  const handleAbilitiesUpdate = React.useCallback (
    newAbilities => {
      setAbilties (newAbilities)
      setActions(newAbilities.join(", "))
      forceUpdate ()
    },
    [ forceUpdate ]
  )
  const handleTalentsUpdate = React.useCallback (
    newTalents => {
      setTalents (newTalents)
      setSkills (newTalents.join(", "))

      forceUpdate ()
    },
    [ forceUpdate ]
  )
  const handleSpecialAbiltiesUpdate = React.useCallback (
    newSpeicalAbilities => {
      setSpecialAbilities (newSpeicalAbilities)

      setSpecialAbility (newSpeicalAbilities.join(", "))

      forceUpdate ()
    },
    [ forceUpdate ]
  )

  return (
    <div id="pet-editor-actions">

      <ActionList
        name={translate (staticData) ("pets.dialogs.addedit.actions")}
        abilities={abilities}
        updated={handleAbilitiesUpdate}
        />
      <ActionList
        name={translate (staticData) ("pets.dialogs.addedit.skills")}
        abilities={talents}
        updated={handleTalentsUpdate}
        />
      <ActionList
        name={translate (staticData) ("pets.dialogs.addedit.specialabilities")}
        abilities={specialAbilities}
        updated={handleSpecialAbiltiesUpdate}
        />
    </div>
  )
}
