import React from "react"
import {
  DerivedCharacteristicId,
} from "../../../../../app/Database/Schema/DerivedCharacteristics/DerivedCharacteristics.l10n"
import { fmap } from "../../../../Data/Functor"
import { find, List } from "../../../../Data/List"
import { bind, bindF, Just, Maybe } from "../../../../Data/Maybe"
import { lookup } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { AttrId } from "../../../Constants/Ids"
import { Pet } from "../../../Models/Hero/Pet"
import { AttributeCombined, AttributeCombinedA_ } from "../../../Models/View/AttributeCombined"
import { DerivedCharacteristic } from "../../../Models/Wiki/DerivedCharacteristic"
import { StaticData, StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { toIntTypeSafe } from "../../../Utilities/NumberUtils"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { renderMaybe } from "../../../Utilities/ReactUtils"
import { AvatarWrapper } from "../../Universal/AvatarWrapper"
import { HorizontalList } from "../../Universal/HorizontalList"
import { Sheet } from "../Sheet"
import { SheetBackground } from "../SheetBackgroundDropdown"
import { SheetHeaderAttribute } from "../SheetHeaderAttribute"
import { SheetWrapper } from "../SheetWrapper"

const SDA = StaticData.A
const ACA_ = AttributeCombinedA_

const getAttrShort =
  (id: AttrId) =>
    pipe (
      find ((a: Record<AttributeCombined>) => ACA_.id (a) === id),
      fmap (ACA_.short),
      renderMaybe
    )

const getDCShort =
  (id: DerivedCharacteristicId) =>
    pipe (
      SDA.derivedCharacteristics,
      lookup (id),
      fmap (DerivedCharacteristic.A.short),
      renderMaybe
    )

const MAX_PETS_PER_SHEET = 2

interface PetSheetProps {
  staticData: StaticDataRecord
  attributes: List<Record<AttributeCombined>>
  background: SheetBackground

  pets: List<Record<Pet>>
}


interface PetSheetAttribute {
  id: AttrId
  valueFunc: (x: Record<Pet>) => Maybe<string>
}
interface PetSheetSubAttribute {
  id: DerivedCharacteristicId|string
  valueFunc: (x: Record<Pet>) => Maybe<string>
}

const PET_ATTRIBUTES: PetSheetAttribute[] = [
  {
    id: AttrId.Courage,
    valueFunc: Pet.A.cou,
  },
  {
    id: AttrId.Sagacity,
    valueFunc: Pet.A.sgc,
  },
  {
    id: AttrId.Intuition,
    valueFunc: Pet.A.int,
  },
  {
    id: AttrId.Charisma,
    valueFunc: Pet.A.cha,
  },
  {
    id: AttrId.Dexterity,
    valueFunc: Pet.A.dex,
  },
  {
    id: AttrId.Agility,
    valueFunc: Pet.A.agi,
  },
  {
    id: AttrId.Constitution,
    valueFunc: Pet.A.con,
  },
  {
    id: AttrId.Strength,
    valueFunc: Pet.A.str,
  },
]
const PET_SUB_ATTRIBUTES: PetSheetSubAttribute[] = [
  {
    id: "LP",
    valueFunc: Pet.A.lp,
  },
  {
    id: "AE",
    valueFunc: Pet.A.ae,
  },
  {
    id: "SPI",
    valueFunc: Pet.A.spi,
  },
  {
    id: "TOU",
    valueFunc: Pet.A.tou,
  },
  {
    id: "PRO",
    valueFunc: Pet.A.pro,
  },
  {
    id: "MOV",
    valueFunc: Pet.A.mov,
  },
]

// @ts-ignore
export const PetSheet: React.FC<PetSheetProps> = props => {
  const {
    staticData,
    attributes,
    background,
    pets,
  } = props

  let currentIndex = 0

  const renderList: Record<Pet>[][] = []
  let currentList: Record<Pet>[] = []
  for (const pet of pets) {
    if (currentIndex >= MAX_PETS_PER_SHEET) {
      renderList.push (currentList)

      currentIndex = 0
      currentList = []
    }

    currentList.push (pet)
    currentIndex++
  }

  renderList.push (currentList)

  const displayAbility =
    (
      key: string,
      abilities: string,
      label: string
    ): JSX.Element|null => {
      if (abilities === "") {
        return null
      }

      const abils = abilities.split (", ")

      if (abils.length < 1) {
        return null
      }

      return (
        <div className="ability-wrapper" key={key}>
          <span className="property-label">
            {label}
          </span>

          {
            abils.map ((val, index) => (
                <span
                  /* eslint-disable-next-line react/no-array-index-key */
                  key={`${key}-abl-${index}`}
                  className="info"
                  >
                  {val}
                </span>
              ))
          }
        </div>
      )
    }

  return renderList.map ((val, upperindex) => {
    if (val.length < 1) {
      return null
    }

    return (
      <SheetWrapper>
        <Sheet
          attributes={attributes}
          id={`pet-sheet-${upperindex}`}
          staticData={staticData}
          title={translate (staticData) ("header.tabs.pets")}
          background={background}
          >
          <div className="pets-wrapper">
            {
              val.map ((pet, index) => {
                const jPet = Just (pet)

                const actualIndex = upperindex * MAX_PETS_PER_SHEET + index

                const notice = pipe_ (jPet, bindF (Pet.A.notes), renderMaybe)

                return (
                  <div key={`pet-${actualIndex}`}>
                    <div className="pet">
                      <div className="pet-avatar">
                        <AvatarWrapper
                          src={bind (jPet) (Pet.A.avatar)}
                          />
                      </div>
                      <div className="name">
                        <h3 style={{ textAlign: "center" }}>
                          {Pet.A.name (pet)}
                        </h3>
                      </div>
                      <HorizontalList className="infos">
                        <span className="info">
                          <span className="property-label">
                            {translate (staticData) ("pets.dialogs.addedit.type")}
                          </span>
                          {":"}
                          {pipe_ (jPet, bindF (Pet.A.type), renderMaybe)}
                        </span>
                        <span className="info">
                          <span className="property-label">
                            {translate (staticData) ("pets.dialogs.addedit.sizecategory")}
                          </span>
                          {":"}
                          {pipe_ (jPet, bindF (Pet.A.size), renderMaybe)}
                        </span>
                        <span className="info">
                          <span className="property-label">
                            {"AP"}
                          </span>
                          {":"}
                          {toIntTypeSafe (Pet.A.spentAp (pet)).toString ()}
                          {"/"}
                          {toIntTypeSafe (Pet.A.totalAp (pet)).toString ()}
                        </span>
                      </HorizontalList>
                      <div className="attributes">
                        {
                          PET_ATTRIBUTES.map (attr => (
                              <SheetHeaderAttribute
                                key={`pet-attribute-${actualIndex}-${attr.id}`}
                                id={attr.id}
                                label={getAttrShort (attr.id) (attributes)}
                                value={Just (toIntTypeSafe (attr.valueFunc (pet)))}
                                />
                            ))
                        }
                      </div>
                      <div className="attributes sub-attributes">
                        {
                          PET_SUB_ATTRIBUTES.map (attr => {
                            const label = (() => {
                              if (attr.id === "PRO") {
                                return translate (staticData)
                                  ("sheets.belongingssheet.animal.protection")
                              }

                              // @ts-ignore
                              return getDCShort (attr.id) (staticData)
                            }) ()

                            return (
                              <SheetHeaderAttribute
                                key={`pet-attribute-${actualIndex}-${attr.id}`}
                                id={attr.id}
                                label={label}
                                value={Just (toIntTypeSafe (attr.valueFunc (pet)))}
                                />
                            )
                          })
                        }
                        <SheetHeaderAttribute
                          key={`pet-attribute-${actualIndex}-ini`}
                          id="INI"
                          label={getDCShort ("INI") (staticData)}
                          value={Pet.A.ini (pet)}
                          />
                      </div>
                      <div className="abilities">
                        <div className="attack">
                          <span className="info attack-label">
                            <span className="property-label">
                              {translate (staticData) ("sheets.belongingssheet.animal.attackname")}
                            </span>
                            <br />
                            {pipe_ (jPet, bindF (Pet.A.attack), renderMaybe)}
                          </span>
                          <div className="attack-attributes">
                            <SheetHeaderAttribute
                              key={`pet-attribute-${actualIndex}-at`}
                              id="INI"
                              label={translate
                              (staticData)
                              ("sheets.belongingssheet.animal.attack")}
                              value={Pet.A.at (pet)}
                              />
                            <SheetHeaderAttribute
                              key={`pet-attribute-${actualIndex}-pa`}
                              id="INI"
                              label={translate
                              (staticData)
                              ("sheets.belongingssheet.animal.parry")}
                              value={Pet.A.pa (pet)}
                              />
                          </div>
                          <span className="info">
                            <span className="property-label">
                              {translate
                              (staticData)
                              ("sheets.belongingssheet.animal.damagepoints")}
                            </span>
                            {": "}
                          {pipe_ (jPet, bindF (Pet.A.dp), renderMaybe)}
                          </span>
                          <br />
                          <span className="info">
                            <span className="property-label">
                              {translate (staticData) ("sheets.belongingssheet.animal.reach")}
                            </span>
                            {": "}
                            {pipe_ (jPet, bindF (Pet.A.reach), renderMaybe)}
                          </span>
                        </div>

                        <div
                          className="general-abilities"
                          >
                          {
                            [
                              displayAbility (
                                "actions",
                                pipe_ (jPet, bindF (Pet.A.actions), renderMaybe),
                                translate (staticData) ("sheets.belongingssheet.animal.actions"),
                              ),
                              displayAbility (
                                "skills",
                                pipe_ (jPet, bindF (Pet.A.talents), renderMaybe),
                                translate (staticData) ("sheets.belongingssheet.animal.skills"),
                              ),
                              displayAbility (
                                "specialabilities",
                                pipe_ (jPet, bindF (Pet.A.skills), renderMaybe),
                                translate
                                  (staticData)
                                  ("sheets.belongingssheet.animal.specialabilities"),
                              ),
                            ]
                          }
                        </div>
                      </div>

                      {
                        notice === ""
                          ? null
                          : (
                          <div className="notice">
                            <span className="property-label">
                              {translate (staticData) ("sheets.belongingssheet.animal.notes")}
                            </span>
                            <br />
                            <span className="info">
                              {notice}
                            </span>
                          </div>
                        )
                      }

                      <div className="vertical-rule" />
                    </div>
                  </div>
                )
              })
            }
          </div>
        </Sheet>
      </SheetWrapper>
    )
  })
}
