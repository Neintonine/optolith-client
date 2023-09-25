import * as React from "react"
import { fromJust, isJust, Maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { EditPet } from "../../Models/Hero/EditPet"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { BorderButton } from "../Universal/BorderButton"
import { Hr } from "../Universal/Hr"
import { Page } from "../Universal/Page"
import { Scroll } from "../Universal/Scroll"
import { Slidein } from "../Universal/Slidein"
import { TextArea } from "../Universal/TextArea"
import { PetEditorActions } from "./PetEditorActions"
import { PetEditorAttack } from "./PetEditorAttack"
import { PetEditorAttributes } from "./PetEditorAttributes"
import { PetEditorGeneral } from "./PetEditorGeneral"

const EPA = EditPet.A

export interface PetEditorProps {
  attributes: StaticData["attributes"]
  petInEditor: Maybe<Record<EditPet>>
  staticData: StaticDataRecord
  isEditPetAvatarOpen: boolean
  isInCreation: Maybe<boolean>

  closePetEditor (): void
  addPet (): void
  savePet (): void
  openEditPetAvatar (): void
  closeEditPetAvatar (): void

  setAvatar (path: string): void
  deleteAvatar (): void
  setName (name: string): void
  setSize (size: string): void
  setType (type: string): void
  setSpentAp (spentAp: string): void
  setTotalAp (totalAp: string): void
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
  setAttack (attack: string): void
  setAt (at: string): void
  setPa (pa: string): void
  setDp (dp: string): void
  setReach (reach: string): void
  setActions (actions: string): void
  setSkills (skills: string): void
  setAbilities (abilities: string): void
  setNotes (notes: string): void
}

export function PetEditor (props: PetEditorProps) {
  const {
    attributes,
    petInEditor: mpet_in_editor,
    staticData,
    isEditPetAvatarOpen,
    isInCreation,

    closePetEditor,
    addPet,
    savePet,
    openEditPetAvatar,
    closeEditPetAvatar,

    setAvatar,
    deleteAvatar,
    setName,
    setSize,
    setType,
    setSpentAp,
    setTotalAp,
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
    setAttack,
    setAt,
    setPa,
    setDp,
    setReach,
    setActions,
    setSkills,
    setAbilities,
    setNotes,
  } = props

  if (isJust (mpet_in_editor)) {
    const pet = fromJust (mpet_in_editor)

    return (
      <Slidein isOpen close={closePetEditor} className="pet-editor">
        <div className="btn-container">
          {Maybe.elem (true) (isInCreation)
            ? (
              <BorderButton
                label={translate (staticData) ("pets.dialogs.addedit.addbtn")}
                onClick={addPet}
                autoWidth
                />
            )
            : (
              <BorderButton
                label={translate (staticData) ("pets.dialogs.addedit.savebtn")}
                onClick={savePet}
                autoWidth
                />
            )}
        </div>
        <Page vertical>
          <Scroll>
            <PetEditorGeneral
              staticData={staticData}
              pet={pet}
              isEditPetAvatarOpen={isEditPetAvatarOpen}
              openEditPetAvatar={openEditPetAvatar}
              closeEditPetAvatar={closeEditPetAvatar}
              setAvatar={setAvatar}
              deleteAvatar={deleteAvatar}
              setName={setName}
              setSize={setSize}
              setType={setType}
              setSpentAp={setSpentAp}
              setTotalAp={setTotalAp}
              />
            <Hr />
            <PetEditorAttributes
              staticData={staticData}
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
              setPro={setPro}
              setAe={setAe}
              setIni={setIni}
              setLp={setLp}
              setMov={setMov}
              setSpi={setSpi}
              setTou={setTou}
              />
            <Hr />
            <PetEditorAttack
              staticData={staticData}
              pet={pet}
              setPa={setPa}
              setAttack={setAttack}
              setAt={setAt}
              setDp={setDp}
              setReach={setReach}
              />
            <Hr />
            <PetEditorActions
              staticData={staticData}
              pet={pet}
              setActions={setActions}
              setSkills={setSkills}
              setSpecialAbility={setAbilities}
              />
            <Hr />
            <div className="pet-editor-part" id="pet-editor-notes">
              <TextArea
                label={translate (staticData) ("pets.dialogs.addedit.notes")}
                value={EPA.notes (pet)}
                onChange={setNotes}
              />
            </div>
          </Scroll>
        </Page>
      </Slidein>
    )
  }

  return null
}
