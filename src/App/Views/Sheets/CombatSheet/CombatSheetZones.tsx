import * as React from "react"
import { List } from "../../../../Data/List"
import { Maybe } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { ActiveActivatable } from "../../../Models/View/ActiveActivatable"
import { AttributeCombined } from "../../../Models/View/AttributeCombined"
import { CombatTechniqueWithAttackParryBase } from "../../../Models/View/CombatTechniqueWithAttackParryBase"
import { HitZoneArmorForView } from "../../../Models/View/HitZoneArmorForView"
import { MeleeWeapon } from "../../../Models/View/MeleeWeapon"
import { RangedWeapon } from "../../../Models/View/RangedWeapon"
import { ShieldOrParryingWeapon } from "../../../Models/View/ShieldOrParryingWeapon"
import { Condition } from "../../../Models/Wiki/Condition"
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility"
import { State } from "../../../Models/Wiki/State"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { DCPair } from "../../../Selectors/derivedCharacteristicsSelectors"
import { translate } from "../../../Utilities/I18n"
import { Maybe as NewMaybe } from "../../../Utilities/Maybe"
import { Sheet } from "../Sheet"
import { SheetBackground } from "../SheetBackgroundDropdown"
import { SheetWrapper } from "../SheetWrapper"
import { getAddCombatHeaderVals } from "./CombatSheet"
import { CombatSheetArmorZones } from "./CombatSheetArmorZones"
import { CombatSheetLifePoints } from "./CombatSheetLifePoints"
import { CombatSheetMeleeWeapons } from "./CombatSheetMeleeWeapons"
import { CombatSheetRangedWeapons } from "./CombatSheetRangedWeapons"
import { CombatSheetShields } from "./CombatSheetShields"
import { CombatSheetSpecialAbilities } from "./CombatSheetSpecialAbilities"
import { CombatSheetStates } from "./CombatSheetStates"
import { CombatSheetTechniques } from "./CombatSheetTechniques"

interface Props {
  armorZones: NewMaybe<Record<HitZoneArmorForView>[]>
  attributes: List<Record<AttributeCombined>>
  combatSpecialAbilities: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>
  combatTechniques: Maybe<List<Record<CombatTechniqueWithAttackParryBase>>>
  derivedCharacteristics: List<DCPair>
  staticData: StaticDataRecord
  meleeWeapons: Maybe<Record<MeleeWeapon>[]>
  rangedWeapons: Maybe<Record<RangedWeapon>[]>
  shieldsAndParryingWeapons: Maybe<Record<ShieldOrParryingWeapon>[]>
  conditions: List<Record<Condition>>
  states: List<Record<State>>
  background: SheetBackground
}

export const CombatSheetZones: React.FC<Props> = props => {
  const {
    armorZones,
    attributes,
    combatSpecialAbilities,
    combatTechniques,
    derivedCharacteristics,
    staticData,
    meleeWeapons,
    rangedWeapons,
    shieldsAndParryingWeapons,
    conditions,
    states,
    background,
  } = props

  const addHeader = getAddCombatHeaderVals (derivedCharacteristics)

  return (
    <SheetWrapper>
      <Sheet
        id="combat-sheet-zones"
        title={translate (staticData) ("sheets.combatsheet.title")}
        addHeaderInfo={addHeader}
        attributes={attributes}
        staticData={staticData}
        background={background}
        >
        <div className="upper">
          <CombatSheetTechniques
            attributes={attributes}
            combatTechniques={combatTechniques}
            staticData={staticData}
            />
          <CombatSheetLifePoints
            derivedCharacteristics={derivedCharacteristics}
            staticData={staticData}
            />
        </div>
        <div className="lower">
          <CombatSheetMeleeWeapons
            staticData={staticData}
            meleeWeapons={meleeWeapons}
            />
          <CombatSheetRangedWeapons
            staticData={staticData}
            rangedWeapons={rangedWeapons}
            />
          <CombatSheetArmorZones
            armorZones={armorZones}
            staticData={staticData}
            />
          <CombatSheetShields
            staticData={staticData}
            shieldsAndParryingWeapons={shieldsAndParryingWeapons}
            />
          <CombatSheetSpecialAbilities
            staticData={staticData}
            combatSpecialAbilities={combatSpecialAbilities}
            />
          <CombatSheetStates staticData={staticData} conditions={conditions} states={states} />
        </div>
      </Sheet>
    </SheetWrapper>
  )
}
