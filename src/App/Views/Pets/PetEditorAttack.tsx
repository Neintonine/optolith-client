import React from "react"
import { List } from "../../../Data/List"
import { Just, Nothing } from "../../../Data/Maybe"
import { Category } from "../../Constants/Categories"
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent"
import { EditPet } from "../../Models/Hero/EditPet"
import { AttributeWithRequirements } from "../../Models/View/AttributeWithRequirements"
import { Attribute } from "../../Models/Wiki/Attribute"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { toIntTypeSafe } from "../../Utilities/NumberUtils"
import { AttributeList } from "../Attributes/AttributeList"
import { TextField } from "../Universal/TextField"
import { Record } from "../../../Data/Record"

const EPA = EditPet.A

interface Props {
  staticData: StaticDataRecord
  pet: Record<EditPet>

  setAttack (attack: string): void

  setAt (at: string): void

  setPa (pa: string): void

  setDp (dp: string): void

  setReach (reach: string): void
}

export const PetEditorAttack: React.FC<Props> = props => {
  const {
    staticData,
    pet,
    setAttack,
    setAt,
    setReach,
    setDp,
    setPa,
  } = props

  const values = {
    ATTACK: {
      set: setAt,
      value: toIntTypeSafe (EPA.at (pet)),
    },
    PARRY: {
      set: setPa,
      value: toIntTypeSafe (EPA.pa (pet)),
    },
  }

  const attributes = Just (List (
    AttributeWithRequirements ({
      wikiEntry: Attribute ({
        id: "ATTACK",
        name: translate (staticData) ("pets.dialogs.addedit.attack"),
        short: translate (staticData) ("pets.dialogs.addedit.attack"),
        category: Category.ATTRIBUTES,
      }),
      stateEntry: AttributeDependent ({
        id: "ATTACK",
        value: values["ATTACK"].value,
        mod: 0,
        dependencies: Nothing,
      }),
      min: 0,
      max: Just (50),
    }),
    AttributeWithRequirements ({
      wikiEntry: Attribute ({
        id: "PARRY",
        name: translate (staticData) ("pets.dialogs.addedit.parry"),
        short: translate (staticData) ("pets.dialogs.addedit.parry"),
        category: Category.ATTRIBUTES,
      }),
      stateEntry: AttributeDependent ({
        id: "PARRY",
        value: values["PARRY"].value,
        mod: 0,
        dependencies: Nothing,
      }),
      min: 0,
      max: Just (50),
    })
  ))

  const addPoint = React.useCallback (
    id => {
      // @ts-ignore
      const value = values[id]

      value.value++
      value.set (`${value.value}`)
    },
    [ values ]
  )
  const subPoint = React.useCallback (
    id => {
      // @ts-ignore
      const value = values[id]

      value.value--
      value.set (`${value.value}`)
    },
    [ values ]
  )

  return (
    <div id="pet-editor-attack" className="has-attributes">
      <div>
        <TextField
          label={translate (staticData) ("pets.dialogs.addedit.attackname")}
          value={EPA.attack (pet)}
          onChange={setAttack}
          />
      </div>

      <AttributeList
        attributes={attributes}
        isInCharacterCreation={false}
        isRemovingEnabled
        maxTotalAttributeValues={Nothing}
        sum={500}
        addPoint={addPoint}
        removePoint={subPoint}
        />

      <div>
        <TextField
          label={translate (staticData) ("pets.dialogs.addedit.damagepoints")}
          value={EPA.dp (pet)}
          onChange={setDp}
          />
      </div>
      <div>
        <TextField
          label={translate (staticData) ("pets.dialogs.addedit.reach")}
          value={EPA.reach (pet)}
          onChange={setReach}
          />
      </div>
    </div>
  )
}
