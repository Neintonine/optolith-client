import * as React from "react"
import { fmap } from "../../../Data/Functor"
import { List } from "../../../Data/List"
import { any, isNothing, Maybe, maybe, maybeRNull } from "../../../Data/Maybe"
import { gt, lt } from "../../../Data/Num"
import { Record } from "../../../Data/Record"
import { ProfessionId, SocialStatusId } from "../../Constants/Ids"
import { HeroModelRecord } from "../../Models/Hero/HeroModel"
import { Sex } from "../../Models/Hero/heroTypeHelpers"
import { PersonalData } from "../../Models/Hero/PersonalData"
import { ActiveActivatable } from "../../Models/View/ActiveActivatable"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { Advantage } from "../../Models/Wiki/Advantage"
import { Culture } from "../../Models/Wiki/Culture"
import { Disadvantage } from "../../Models/Wiki/Disadvantage"
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel"
import { Profession } from "../../Models/Wiki/Profession"
import { Race } from "../../Models/Wiki/Race"
import { RaceVariant } from "../../Models/Wiki/RaceVariant"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate, translateP } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { renderMaybe, renderMaybeWith } from "../../Utilities/ReactUtils"
import { ActivatableTextList } from "../Activatable/ActivatableTextList"
import { AvatarChange } from "../Universal/AvatarChange"
import { AvatarWrapper } from "../Universal/AvatarWrapper"
import { BorderButton } from "../Universal/BorderButton"
import { EditText } from "../Universal/EditText"
import { IconButton } from "../Universal/IconButton"
import { Page } from "../Universal/Page"
import { Scroll } from "../Universal/Scroll"
import { VerticalList } from "../Universal/VerticalList"
import { OverviewAddAP } from "./OverviewAddAP"
import { OverviewPersonalData, OverviewPersonalDataDispatchProps } from "./OverviewPersonalData"

export interface PersonalDataOwnProps {
  staticData: StaticDataRecord
  hero: HeroModelRecord
}

export interface PersonalDataStateProps {
  apLeft: Maybe<number>
  apTotal: Maybe<number>
  advantages: Maybe<List<Record<ActiveActivatable<Advantage>>>>
  avatar: Maybe<string>
  culture: Maybe<Record<Culture>>
  currentEl: Maybe<Record<ExperienceLevel>>
  disadvantages: Maybe<List<Record<ActiveActivatable<Disadvantage>>>>
  name: Maybe<string>
  phase: Maybe<number>
  profession: Maybe<Record<Profession>>
  professionName: Maybe<string>
  fullProfessionName: Maybe<string>
  profile: Record<PersonalData>
  race: Maybe<Record<Race>>
  raceVariant: Maybe<Record<RaceVariant>>
  sex: Maybe<Sex>
  socialStatuses: List<Record<DropdownOption<SocialStatusId>>>
  isRemovingEnabled: boolean
  isAddAdventurePointsOpen: boolean
  isEditCharacterAvatarOpen: boolean
  sizeCalcStr: Maybe<string>
  weightCalcStr: Maybe<string>
  hairColors: List<Record<DropdownOption<number>>>
  eyeColors: List<Record<DropdownOption<number>>>
}

export interface PersonalDataDispatchProps extends OverviewPersonalDataDispatchProps {
  setAvatar (path: string): void
  deleteAvatar (): void
  setHeroName (name: string): void
  setCustomProfessionName (name: string): void
  endCharacterCreation (): void
  addAdventurePoints (ap: number): void
  openAddAdventurePoints (): void
  closeAddAdventurePoints (): void
  openEditCharacterAvatar (): void
  closeEditCharacterAvatar (): void
}

export type PersonalDataProps =
  PersonalDataStateProps
  & PersonalDataDispatchProps
  & PersonalDataOwnProps

export interface PersonalDataState {
  editName: boolean
  editProfessionName: boolean
}

export const PersonalDataView: React.FC<PersonalDataProps> = props => {
  const {
    advantages: maybeAdvantages,
    avatar,
    apLeft,
    apTotal,
    culture,
    currentEl,
    disadvantages: maybeDisadvantages,
    endCharacterCreation,
    staticData,
    name,
    phase,
    profession,
    professionName,
    fullProfessionName,
    profile,
    race,
    raceVariant,
    sex: maybeSex,
    socialStatuses,
    isAddAdventurePointsOpen,
    isEditCharacterAvatarOpen,
    openAddAdventurePoints,
    openEditCharacterAvatar,
    closeAddAdventurePoints,
    closeEditCharacterAvatar,
    setAvatar,
    deleteAvatar,
    changeFamily,
    changePlaceOfBirth,
    changeDateOfBirth,
    changeAge,
    changeHaircolor,
    changeEyecolor,
    changeSize,
    changeWeight,
    changeTitle,
    changeSocialStatus,
    changeCharacteristics,
    changeOtherInfo,
    changeCultureAreaKnowledge,
    rerollHair,
    rerollEyes,
    rerollSize,
    rerollWeight,
    sizeCalcStr,
    weightCalcStr,
    isRemovingEnabled,
    addAdventurePoints,
    hairColors,
    eyeColors,
    setHeroName,
    setCustomProfessionName,
  } = props

  const [ isEditingName, setIsEditingName ] = React.useState (false)
  const [ isEditingProfessionName, setIsEditingProfessionName ] = React.useState (false)

  const handleEditName = React.useCallback (
    (new_name: string) => {
      setHeroName (new_name)
      setIsEditingName (false)
    },
    [ setHeroName ]
  )

  const handleEditProfessionName = React.useCallback (
    (new_name: string) => {
      setCustomProfessionName (new_name)
      setIsEditingProfessionName (false)
    },
    [ setCustomProfessionName ]
  )

  const handleStartEditName = React.useCallback (
    () => setIsEditingName (true),
    [ setIsEditingName ]
  )

  const handleCancelEditName = React.useCallback (
    () => setIsEditingName (false),
    [ setIsEditingName ]
  )

  const handleStartEditProfessionName = React.useCallback (
    () => setIsEditingProfessionName (true),
    [ setIsEditingProfessionName ]
  )

  const handleCancelEditProfessionName = React.useCallback (
    () => setIsEditingProfessionName (false),
    [ setIsEditingProfessionName ]
  )

  const isOwnProfession =
    pipe_ (
      profession,
      fmap (Profession.A.id),
      Maybe.elem<string> (ProfessionId.CustomProfession)
    )

  const isProfessionUndefined = isNothing (profession)

  const nameElement = isEditingName
    ? (
      <EditText
        className="change-name"
        cancel={handleCancelEditName}
        submit={handleEditName}
        text={renderMaybe (name)}
        autoFocus
        />
    )
    : (
      <h1 className="confirm-edit">
        {renderMaybe (name)}
        <IconButton icon="&#xE90c;" onClick={handleStartEditName} />
      </h1>
    )

  const professionNameElement =
    any (gt (1)) (phase) && isOwnProfession
      ? (isEditingProfessionName
        ? (
          <EditText
            cancel={handleCancelEditProfessionName}
            submit={handleEditProfessionName}
            text={renderMaybe (professionName)}
            />
        )
        : (
          <BorderButton
            className="edit-profession-name-btn"
            label={translate (staticData) ("profile.editprofessionnamebtn")}
            onClick={handleStartEditProfessionName}
            />
        ))
      : null

  return (
    <Page id="personal-data">
      <Scroll className="text">
        <div className="title-wrapper">
          <AvatarWrapper src={avatar} onClick={openEditCharacterAvatar} editable />
          <div className="text-wrapper">
            {nameElement}
            {
              isProfessionUndefined
              ? null
              : (
                <VerticalList className="rcp">
                  {
                    maybe (<></>)
                          ((sex: Sex) => (
                              <span>
                                {translate (staticData)
                                           (sex === "m"
                                             ? "personaldata.sex.male"
                                             : "personaldata.sex.female")}
                              </span>
                            ))
                          (maybeSex)
                  }
                  <span className="race">
                    {renderMaybeWith (Race.A.name) (race)}
                    {renderMaybeWith (pipe (
                                       RaceVariant.A.name,
                                       str => ` (${str})`
                                     ))
                                     (raceVariant)}
                  </span>
                  <span className="culture">
                    {renderMaybeWith (Culture.A.name) (culture)}
                  </span>
                  <span className="profession">
                    {renderMaybe (fullProfessionName)}
                  </span>
                </VerticalList>
              )
            }
            <VerticalList className="el">
              <span>
                {renderMaybeWith (ExperienceLevel.A.name) (currentEl)}
              </span>
              <span>
                {translateP (staticData)
                            ("general.apvalue.short")
                            (List (Maybe.sum (apTotal)))}
              </span>
            </VerticalList>
          </div>
        </div>
        <div className="main-profile-actions">
          {
            Maybe.elem (3) (phase)
              ? (
                  <BorderButton
                    className="add-ap"
                    label={translate (staticData) ("profile.addadventurepointsbtn")}
                    onClick={openAddAdventurePoints}
                    />
                )
              : null
          }
          <BorderButton
            className="delete-avatar"
            label={translate (staticData) ("profile.deleteavatarbtn")}
            onClick={deleteAvatar}
            disabled={isNothing (avatar)}
            />
          {professionNameElement}
        </div>
        {
          isProfessionUndefined
          ? null
          : (
            <>
              <h3>{translate (staticData) ("personaldata.title")}</h3>
              <OverviewPersonalData
                profile={profile}
                socialStatuses={socialStatuses}
                sizeCalcStr={sizeCalcStr}
                weightCalcStr={weightCalcStr}
                staticData={staticData}
                changeFamily={changeFamily}
                changePlaceOfBirth={changePlaceOfBirth}
                changeDateOfBirth={changeDateOfBirth}
                changeAge={changeAge}
                changeHaircolor={changeHaircolor}
                changeEyecolor={changeEyecolor}
                changeSize={changeSize}
                changeWeight={changeWeight}
                changeTitle={changeTitle}
                changeSocialStatus={changeSocialStatus}
                changeCharacteristics={changeCharacteristics}
                changeOtherInfo={changeOtherInfo}
                changeCultureAreaKnowledge={changeCultureAreaKnowledge}
                rerollHair={rerollHair}
                rerollEyes={rerollEyes}
                rerollSize={rerollSize}
                rerollWeight={rerollWeight}
                hairColors={hairColors}
                eyeColors={eyeColors}
                />
            </>
          )
        }
        {
          Maybe.elem (2) (phase)
            ? (
              <div>
                <BorderButton
                  className="end-char-creation"
                  label={translate (staticData) ("profile.endherocreationbtn")}
                  onClick={endCharacterCreation}
                  primary
                  disabled={any (lt (0)) (apLeft) || any (gt (10)) (apLeft)}
                  />
              </div>
            )
            : null
        }
        {
          Maybe.elem (3) (phase)
            ? (
              <div>
                <h3>{translate (staticData) ("profile.advantages")}</h3>
                {maybeRNull ((advantages: List<Record<ActiveActivatable>>) => (
                                <ActivatableTextList
                                  list={advantages}
                                  staticData={staticData}
                                  />
                              ))
                            (maybeAdvantages)}
                <h3>{translate (staticData) ("profile.disadvantages")}</h3>
                {maybeRNull ((disadvantages: List<Record<ActiveActivatable>>) => (
                                <ActivatableTextList
                                  list={disadvantages}
                                  staticData={staticData}
                                  />
                              ))
                            (maybeDisadvantages)}
              </div>
            )
          : null
        }
      </Scroll>
      <OverviewAddAP
        close={closeAddAdventurePoints}
        isOpen={isAddAdventurePointsOpen}
        isRemovingEnabled={isRemovingEnabled}
        addAdventurePoints={addAdventurePoints}
        staticData={staticData}
        />
      <AvatarChange
        setPath={setAvatar}
        close={closeEditCharacterAvatar}
        isOpen={isEditCharacterAvatarOpen}
        staticData={staticData}
        />
    </Page>
  )
}
