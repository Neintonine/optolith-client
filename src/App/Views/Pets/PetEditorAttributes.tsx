import React from "react"
import {
  DerivedCharacteristicId,
} from "../../../../app/Database/Schema/DerivedCharacteristics/DerivedCharacteristics.l10n"
import { fmap } from "../../../Data/Functor"
import { consF, List } from "../../../Data/List"
import { Just, Nothing } from "../../../Data/Maybe"
import { foldr } from "../../../Data/OrderedMap"
import { lookup } from "../../../Data/OrderedMap"
import { Category } from "../../Constants/Categories"
import { AttrId } from "../../Constants/Ids"
import {
  AttributeDependent,
} from "../../Models/ActiveEntries/AttributeDependent"
import { EditPet } from "../../Models/Hero/EditPet"
import { AttributeWithRequirements } from "../../Models/View/AttributeWithRequirements"
import { Attribute } from "../../Models/Wiki/Attribute"
import { DerivedCharacteristic } from "../../Models/Wiki/DerivedCharacteristic"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { Record } from "../../../Data/Record"
import { translate } from "../../Utilities/I18n"
import { toIntTypeSafe } from "../../Utilities/NumberUtils"
import { pipe } from "../../Utilities/pipe"
import { renderMaybe } from "../../Utilities/ReactUtils"
import { AttributeList } from "../Attributes/AttributeList"
import { TextField } from "../Universal/TextField"


const EPA = EditPet.A
const SDA = StaticData.A

const getDCShort =
  (id: DerivedCharacteristicId) =>
    pipe (
      SDA.derivedCharacteristics,
      lookup (id),
      fmap (DerivedCharacteristic.A.short),
      renderMaybe
    )
const getDCLong =
  (id: DerivedCharacteristicId) =>
    pipe (
      SDA.derivedCharacteristics,
      lookup (id),
      fmap (DerivedCharacteristic.A.name),
      renderMaybe
    )

enum PetEditorSubAttributes {
  LP = "ATTR_LP",
  AE = "ATTR_AE",
  SPI = "ATTR_SPI",
  TOU = "ATTR_TOU",
  INI = "ATTR_INI",
  MOV = "ATTR_MOV",
  PRO = "ATTR_PRO",
}

interface Props {
  staticData: StaticDataRecord
  pet: Record<EditPet>
  attributes: StaticData["attributes"]

  setCourage (courage: string): void
  setSagacity (sagacity: string): void
  setIntuition (intuition: string): void
  setCharisma (charisma: string): void
  setDexterity (dexterity: string): void
  setAgility (agility: string): void
  setConstitution (constitution: string): void
  setStrength (strength: string): void

  setLp (lp: string): void
  setAe (ae: string): void
  setSpi (spi: string): void
  setTou (tou: string): void
  setPro (pro: string): void
  setIni (ini: string): void
  setMov (mov: string): void
}

interface MainAttributesProps {
  pet: Record<EditPet>
  attributes: StaticData["attributes"]

  setCourage (courage: string): void
  setSagacity (sagacity: string): void
  setIntuition (intuition: string): void
  setCharisma (charisma: string): void
  setDexterity (dexterity: string): void
  setAgility (agility: string): void
  setConstitution (constitution: string): void
  setStrength (strength: string): void
}

interface SideAttributesProps {
  pet: Record<EditPet>
  staticData: StaticDataRecord
  setLp (lp: string): void
  setAe (ae: string): void
  setSpi (spi: string): void
  setTou (tou: string): void
  setPro (pro: string): void
  setMov (mov: string): void
}

const MainAttributes: React.FC<MainAttributesProps> = props => {
  const {
    pet,
    attributes,

    setCourage,
    setSagacity,
    setIntuition,
    setCharisma,
    setDexterity,
    setAgility,
    setConstitution,
    setStrength,
  } = props

  const values = {
    [AttrId.Courage]: toIntTypeSafe (EPA.cou (pet)),
    [AttrId.Sagacity]: toIntTypeSafe (EPA.sgc (pet)),
    [AttrId.Intuition]: toIntTypeSafe (EPA.int (pet)),
    [AttrId.Charisma]: toIntTypeSafe (EPA.cha (pet)),
    [AttrId.Dexterity]: toIntTypeSafe (EPA.dex (pet)),
    [AttrId.Agility]: toIntTypeSafe (EPA.agi (pet)),
    [AttrId.Constitution]: toIntTypeSafe (EPA.con (pet)),
    [AttrId.Strength]: toIntTypeSafe (EPA.str (pet)),
  }

  const functions = {
    [AttrId.Courage]: setCourage,
    [AttrId.Sagacity]: setSagacity,
    [AttrId.Intuition]: setIntuition,
    [AttrId.Charisma]: setCharisma,
    [AttrId.Dexterity]: setDexterity,
    [AttrId.Agility]: setAgility,
    [AttrId.Constitution]: setConstitution,
    [AttrId.Strength]: setStrength,
  }

  const addPoint = React.useCallback (
    id => {
      // @ts-ignore
      const setFunction = functions[id]
      // @ts-ignore
      values[id]++

      // @ts-ignore
      setFunction (`${values[id]}`)
    },
    []
  )
  const removePoint = React.useCallback (
    id => {
      // @ts-ignore
      const setFunction = functions[id]
      // @ts-ignore
      values[id]--

      // @ts-ignore
      setFunction (`${values[id]}`)
    },
    []
  )

  const attributeList =
    foldr ((wiki_entry: Record<Attribute>) => {
      const id = Attribute.A.id (wiki_entry)

      const max_value = Just (20)

      const min_value = 0

      // @ts-ignore
      return consF (AttributeWithRequirements ({
        max: max_value,
        min: min_value,
        stateEntry: AttributeDependent ({
          id: "",
          // @ts-ignore
          value: values[id],
          mod: 0,
          dependencies: Nothing,
        }),
        wikiEntry: wiki_entry,
      }))
    })
    (List.empty)
    (attributes)

  return (
    <div className="main-attributes">
      <AttributeList
        attributes={Just (attributeList)}
        isInCharacterCreation={false}
        isRemovingEnabled
        maxTotalAttributeValues={Nothing}
        sum={500}
        addPoint={addPoint}
        removePoint={removePoint}
        />
    </div>
  )
}

const SideAttributes: React.FC<SideAttributesProps> = props => {
  const {
    staticData,
    pet,
    setLp,
    setAe,
    setSpi,
    setTou,
    setPro,
    setMov,
  } = props

  const sideAttributes = {
    [PetEditorSubAttributes.LP]: {
      name: getDCLong ("LP") (staticData),
      short: getDCShort ("LP") (staticData),
      value: toIntTypeSafe (EPA.lp (pet)),
      min: 0,
      max: 50,
      setValue: setLp,
    },
    [PetEditorSubAttributes.AE]: {
      name: getDCLong ("AE") (staticData),
      short: getDCShort ("AE") (staticData),
      value: toIntTypeSafe (EPA.ae (pet)),
      min: 0,
      max: 50,
      setValue: setAe,
    },
    [PetEditorSubAttributes.SPI]: {
      name: getDCLong ("SPI") (staticData),
      short: getDCShort ("SPI") (staticData),
      value: toIntTypeSafe (EPA.spi (pet)),
      min: -20,
      max: 50,
      setValue: setSpi,
    },
    [PetEditorSubAttributes.TOU]: {
      name: getDCLong ("TOU") (staticData),
      short: getDCShort ("TOU") (staticData),
      value: toIntTypeSafe (EPA.tou (pet)),
      min: -20,
      max: 50,
      setValue: setTou,
    },
    [PetEditorSubAttributes.PRO]: {
      name: translate (staticData) ("pets.dialogs.addedit.protection"),
      value: toIntTypeSafe (EPA.pro (pet)),
      min: 0,
      max: 50,
      setValue: setPro,
    },
    [PetEditorSubAttributes.MOV]: {
      name: getDCLong ("MOV") (staticData),
      short: getDCShort ("MOV") (staticData),
      value: toIntTypeSafe (EPA.mov (pet)),
      min: 0,
      max: 50,
      setValue: setMov,
    },
  }

  const attributes = []
  for (const sideAttributesKey in sideAttributes) {
    // @ts-ignore
    const sideAttribute = sideAttributes [sideAttributesKey]

    const attribute = AttributeWithRequirements ({
      wikiEntry: Attribute ({
        id: sideAttributesKey,
        name: sideAttribute.name,
        short: sideAttribute.short ?? sideAttribute.name,
        category: Category.ATTRIBUTES,
      }),
      stateEntry: AttributeDependent ({
        id: sideAttributesKey,
        value: sideAttribute.value,
        mod: 0,
        dependencies: Nothing,
      }),
      min: sideAttribute.min ?? 0,
      max: Just (sideAttribute.max ?? 50),
    })

    attributes.push (attribute)
  }

  const addPointCallback =
    React.useCallback (
      id => {
        // @ts-ignore
        const setFunc = sideAttributes[id].setValue
        // @ts-ignore
        sideAttributes[id].value++
        // @ts-ignore
        setFunc (`${sideAttributes[id].value}`)
      },
      [ sideAttributes ]
    )

  const subPointCallback =
    React.useCallback (
      id => {
        // @ts-ignore
        const setFunc = sideAttributes[id].setValue
        // @ts-ignore
        sideAttributes[id].value--

        // @ts-ignore
        setFunc (`${sideAttributes[id].value}`)
      },
      [ sideAttributes ]
    )

  return (
    <div className="side-attributes">
      <AttributeList
        attributes={Just (List (...attributes))}
        isInCharacterCreation={false}
        isRemovingEnabled
        maxTotalAttributeValues={Nothing}
        sum={500}
        addPoint={addPointCallback}
        removePoint={subPointCallback}
        />
    </div>
  )
}

export const PetEditorAttributes: React.FC<Props> = props => {
  const {
    staticData,
    pet,
    attributes,
    setCourage,
    setSagacity,
    setIntuition,
    setCharisma,
    setDexterity,
    setAgility,
    setConstitution,
    setStrength,
    setLp,
    setAe,
    setSpi,
    setTou,
    setPro,
    setIni,
    setMov,
  } = props

  return (
    <div id="pet-editor-attributes" className="has-attributes">
      <MainAttributes
        pet={pet}
        attributes={attributes}
        setCourage={setCourage}
        setAgility={setAgility}
        setConstitution={setConstitution}
        setStrength={setStrength}
        setCharisma={setCharisma}
        setDexterity={setDexterity}
        setIntuition={setIntuition}
        setSagacity={setSagacity}
        />
      <SideAttributes
        pet={pet}
        staticData={staticData}
        setAe={setAe}
        setLp={setLp}
        setTou={setTou}
        setSpi={setSpi}
        setMov={setMov}
        setPro={setPro}
        />
      <div className="initive">
        <TextField
          label={getDCLong ("INI") (staticData)}
          value={EPA.ini (pet)}
          onChange={setIni}
          />
      </div>
    </div>
      )
}
