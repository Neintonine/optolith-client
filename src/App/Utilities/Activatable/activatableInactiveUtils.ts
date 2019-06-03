/**
 * Get the needed options for `Activatable` entries that are available to
 * activate.
 *
 * @file src/Utilities/activatableInactiveUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { equals } from "../../../Data/Eq";
import { ident, thrush } from "../../../Data/Function";
import { fmap, fmapF, mapReplace } from "../../../Data/Functor";
import { over, set } from "../../../Data/Lens";
import { consF, countWith, elem, filter, find, flength, fnull, foldr, isList, List, map, mapByIdKeyMap, maximum, notElem, notElemF, notNull, subscript } from "../../../Data/List";
import { all, bind, bindF, ensure, fromJust, fromMaybe, guard, guard_, isJust, join, Just, liftM2, listToMaybe, mapMaybe, Maybe, maybe, Nothing, or } from "../../../Data/Maybe";
import { alter, elems, foldrWithKey, isOrderedMap, lookup, lookupF, member, OrderedMap } from "../../../Data/OrderedMap";
import { fst, Pair, snd } from "../../../Data/Pair";
import { Record, RecordI } from "../../../Data/Record";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent";
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject";
import { SkillDependent } from "../../Models/ActiveEntries/SkillDependent";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { Pact } from "../../Models/Hero/Pact";
import { AdventurePointsCategories } from "../../Models/View/AdventurePointsCategories";
import { InactiveActivatable, InactiveActivatableL } from "../../Models/View/InactiveActivatable";
import { Advantage } from "../../Models/Wiki/Advantage";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant";
import { Spell } from "../../Models/Wiki/Spell";
import { Application } from "../../Models/Wiki/sub/Application";
import { SelectOption, SelectOptionL } from "../../Models/Wiki/sub/SelectOption";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { Activatable } from "../../Models/Wiki/wikiTypeHelpers";
import { countActiveGroupEntries } from "../entryGroupUtils";
import { getAllEntriesByGroup } from "../heroStateUtils";
import { getBlessedTradStrIdFromNumId } from "../IDUtils";
import { getTraditionOfAspect } from "../Increasable/liturgicalChantUtils";
import { add, gt, gte, inc, lt, multiply, subtract } from "../mathUtils";
import { pipe, pipe_ } from "../pipe";
import { validateLevel, validatePrerequisites } from "../Prerequisites/validatePrerequisitesUtils";
import { sortRecordsByName } from "../sortBy";
import { isNumber, isString, misStringM } from "../typeCheckUtils";
import { isAdditionDisabled } from "./activatableInactiveValidationUtils";
import { getModifierByActiveLevel } from "./activatableModifierUtils";
import { countActiveSkillEntries } from "./activatableSkillUtils";
import { isMaybeActive } from "./isActive";
import { findSelectOption, getActiveSecondarySelections, getActiveSelectionsMaybe, getRequiredSelections } from "./selectionUtils";
import { getBlessedTradition, getMagicalTraditionsHeroEntries } from "./traditionUtils";

const {
  combatTechniques,
  liturgicalChants,
  skills,
  spells,
  specialAbilities,
} = WikiModel.AL

const {
  advantages: hero_advantages,
  combatTechniques: hero_combatTechniques,
  disadvantages: hero_disadvantages,
  liturgicalChants: hero_liturgicalChants,
  skills: hero_skills,
  spells: hero_spells,
  specialAbilities: hero_specialAbilities,
  pact,
} = HeroModel.AL

const { select, id, cost, prerequisites } = Advantage.AL
const { aspects, ic } = LiturgicalChant.AL
const { property } = Spell.AL
const { active, dependencies } = ActivatableDependent.AL
const { value } = ActivatableSkillDependent.AL

const SOA = SelectOption.A
const AppA = Application.A
const SpAL = Spell.AL

const { cost: select_costL, applications, name: nameL } = SelectOptionL
const { sid, tier } = ActiveObject.AL
const { maxLevel, cost: costL } = InactiveActivatableL
const { level: pact_level } = Pact.AL
const { spentOnMagicalAdvantages, spentOnMagicalDisadvantages } = AdventurePointsCategories.AL

/**
 * `isNotActive :: Maybe ActivatableDependent -> SelectOption -> Bool`
 *
 * Test if the id of the passed select option is activated for the passed
 * `ActivatableDependent`.
 */
const isNotActive =
  pipe (
    getActiveSelectionsMaybe,
    fromMaybe<List<string | number>> (List.empty),
    activeSelections => pipe (
      SOA.id,
      notElemF (activeSelections)
    )
  )

/**
 * `areNoSameActive :: Maybe ActivatableDependent -> SelectOption -> Bool`
 *
 * Test if a select option is not activated more than once for the passed
 * `ActivatableDependent`.
 */
const areNoSameActive =
  pipe (
    getActiveSelectionsMaybe,
    fromMaybe<List<string | number>> (List.empty),
    activeSelections => pipe (
      SOA.id,
      current_id => countWith (equals (current_id)) (activeSelections) < 2
    )
  )

/**
 * `isNotRequired :: Maybe ActivatableDependent -> SelectOption -> Bool`
 *
 * Test if the id of the passed select option is required for the passed
 * `ActivatableDependent`.
 */
const isNotRequired =
  pipe (
    getRequiredSelections,
    fromMaybe<List<string | number | List<number>>> (List.empty),
    requiredSelections => pipe (
      SOA.id,
      notElemF (requiredSelections)
    )
  )


/**
 * `isNotRequiredNotActive :: Maybe ActivatableDependent -> SelectOption -> Bool`
 *
 * Test if the id of the passed select option is neither required nor activated
 * for the passed `ActivatableDependent`.
 */
const isNotRequiredNotActive =
  (mhero_entry: Maybe<Record<ActivatableDependent>>) => {
    const isNoActiveSelection = isNotActive (mhero_entry)
    const isNoRequiredSelection = isNotRequired (mhero_entry)

    return (e: Record<SelectOption>) =>
      isNoActiveSelection (e) && isNoRequiredSelection (e)
  }

/**
 * Increment the value at the specified key by `1`. If there is no value at that
 * key, the value will be set to `0`.
 */
const incMapVal = alter (pipe (maybe (0) (inc), Just))

const addChantToCounter =
  (chant: Record<LiturgicalChant>) =>
    pipe (
      foldr<number, OrderedMap<number, number>> (incMapVal),
      thrush (aspects (chant))
    )

const addSpellToCounter = pipe (property, incMapVal)

const filterSkills = filter<Record<ActivatableSkillDependent>> (pipe (value, gte (10)))

const foldCounter =
  foldrWithKey<number, number, List<number>> (k => x => x >= 3 ? consF (k) : ident)
                                             (List.empty)

/**
 * `getPropsWith3Gte10 :: Wiki -> Hero -> [Int]`
 *
 * Returns a list containing all properties where at least 3 spells with at
 * least SR 10 belong to.
 */
const getPropsWith3Gte10 =
  (wiki: WikiModelRecord) =>
    pipe (
      hero_spells,
      elems,
      filterSkills,
      mapByIdKeyMap (spells (wiki)),
      foldr (addSpellToCounter) (OrderedMap.empty),
      foldCounter
    )

/**
 * `getAspectsWith3Gte10 :: Wiki -> Hero -> [Int]`
 *
 * Returns a list containing all aspects where at least 3 chants with at least
 * SR 10 belong to.
 */
const getAspectsWith3Gte10 =
  (wiki: WikiModelRecord) =>
    pipe (
      hero_liturgicalChants,
      elems,
      filterSkills,
      mapByIdKeyMap (liturgicalChants (wiki)),
      foldr (addChantToCounter) (OrderedMap.empty),
      foldCounter
    )

const list7and8 = List (7, 8)

/**
 * Modifies the select options of specific entries to match current conditions.
 */
const modifySelectOptions =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (wiki_entry: Activatable) =>
  // tslint:disable-next-line: cyclomatic-complexity
  (mhero_entry: Maybe<Record<ActivatableDependent>>): Maybe<List<Record<SelectOption>>> => {
    const current_id = id (wiki_entry)
    const mcurrent_select = select (wiki_entry)

    const isNoRequiredOrActiveSelection =
      isNotRequiredNotActive (mhero_entry)

    const isNoRequiredSelection =
      isNotRequired (mhero_entry)

    switch (current_id) {
      // Exceptional Skill
      case "ADV_16": {
        const hasLessThanTwoSameIdActiveSelections =
          areNoSameActive (mhero_entry)

        return fmap (filter ((e: Record<SelectOption>) =>
                              hasLessThanTwoSameIdActiveSelections (e)
                              && isNoRequiredSelection (e)))
                    (mcurrent_select)
      }

      // Immunity to (Poison)
      case "ADV_28":
      // Immunity to (Disease)
      case "ADV_29":
      // Afraid of ...
      case "DISADV_1":
      // Principles
      case "DISADV_34":
      // Obligations
      case "DISADV_50":
        return fmap (filter (isNotRequired (mhero_entry)))
                    (mcurrent_select)

      // Magical Attunement
      case "ADV_32":
      // Magical Restriction
      case "DISADV_24": {
        const flipped_id = current_id === "DISADV_24" ? "ADV_32" : "DISADV_24"

        // Selection must not be active on the other entry, respectively.
        const isNotActiveOnOther =
          isNotActive (lookup (flipped_id) (hero_disadvantages (hero)))

        return fmap (filter ((e: Record<SelectOption>) =>
                              isNotActiveOnOther (e)
                              && isNoRequiredSelection (e)))
                    (mcurrent_select)
      }

      // Personality Flaws
      case "DISADV_33":
      // Negative Trait
      case "DISADV_37":
      // Maimed/Verstümmelt
      case "DISADV_51": {
        if (current_id === "DISADV_33") {
          return fmap (filter (
                                (e: Record<SelectOption>) =>
                                  elem (SOA.id (e) as number) (list7and8)
                                  || isNoRequiredOrActiveSelection (e)
                              ))
                              (mcurrent_select)
        }
        else {
          return fmap (filter (isNoRequiredOrActiveSelection)) (mcurrent_select)
        }
      }

      // Incompetent
      case "DISADV_48": {
        const isAdvActive =
          pipe (lookupF (hero_advantages (hero)), isMaybeActive)

        const isSkillOfIcB =
          pipe (
            SOA.id,
            ensure (isString),
            bindF (lookupF (skills (wiki))),
            fmap (pipe (ic, equals (2))),
            or
          )

        return fmap (filter ((e: Record<SelectOption>) =>
                              (isAdvActive ("ADV_40") || isAdvActive ("ADV_46"))
                              && isSkillOfIcB (e)
                              || isNoRequiredOrActiveSelection (e)))
                    (mcurrent_select)
      }

      // Trade Secret
      case "SA_3":
      // Writing
      case "SA_28":
      // Gebieter
      case "SA_639": {
        return fmap (filter ((e: Record<SelectOption>) =>
                              isNoRequiredOrActiveSelection (e)
                              && maybe (true)
                                       (pipe (
                                         validatePrerequisites (wiki)
                                                               (hero),
                                         thrush (current_id)
                                       ))
                                       (SOA.prerequisites (e))))
                    (mcurrent_select)
      }

      // Skill Specialization
      case "SA_9": {
        const mcounter = getActiveSecondarySelections (mhero_entry)

        return fmap (pipe (
                            filter ((e: Record<SelectOption>) => {
                                     const curr_select_id = SOA.id (e)

                                     if (isJust (mcounter)) {
                                       const counter = fromJust (mcounter)

                                       if (isNoRequiredSelection (e)) {
                                         return false
                                       }

                                       if (member (curr_select_id) (counter)) {
                                         return isAddExistSkillSpecAllowed (hero)
                                                                           (counter)
                                                                           (curr_select_id)
                                       }
                                     }
                                     else if (isNoRequiredSelection (e)) {
                                       return false
                                     }

                                     return isAddNotExistSkillSpecAllowed (hero)
                                                                          (curr_select_id)
                                   }),
                            map (e => {
                                  const curr_select_id = SOA.id (e)

                                  const mcounts = bind (mcounter) (lookup (curr_select_id))

                                  const adjustSelectOption =
                                    pipe (
                                      over (select_costL)
                                           (isJust (mcounts)
                                             // Increase cost if there are active specializations
                                             // for the same skill
                                             ? fmap (multiply (flength (fromJust (mcounts)) + 1))

                                             // otherwise return current cost
                                             : ident),
                                      over (applications)
                                           (fmap (filter (app => {
                                                           const isInactive =
                                                             all (notElem<number | string>
                                                                   (AppA.id (app)))
                                                                 (mcounts)

                                                           const arePrerequisitesMet =
                                                             all (pipe (
                                                                   validatePrerequisites (wiki)
                                                                                         (hero),
                                                                   thrush (current_id)
                                                                 ))
                                                                 (AppA.prerequisites (app))

                                                           return isInactive && arePrerequisitesMet
                                                         })))
                                    )

                                  return adjustSelectOption (e)
                                })
                    ))
                    (mcurrent_select)
      }

      // Languages
      case "SA_29": {
        const actives =
          maybe (List<Record<ActiveObject>> ())
                (active)
                (mhero_entry)

        return fmap (filter ((e: Record<SelectOption>) =>
                              isNoRequiredSelection (e)
                              && List.all (pipe (sid, Maybe.notElem (SOA.id (e))))
                                          (actives)))
                    (mcurrent_select)
      }

      // Property Knowledge
      case "SA_72": {
        const valid_props = getPropsWith3Gte10 (wiki) (hero)

        return fmap (filter ((e: Record<SelectOption>) =>
                              isNoRequiredOrActiveSelection (e)
                              && notElem (SOA.id (e)) (valid_props)))
                    (mcurrent_select)
      }

      // Property Focus
      case "SA_81": {
        const isNoActivePropertyKnowledge =
          pipe (hero_specialAbilities, lookup ("SA_72"), isNotActive)
               (hero)

        return fmap (filter ((e: Record<SelectOption>) =>
                              isNoRequiredOrActiveSelection (e)
                              && isNoActivePropertyKnowledge (e)))
                    (mcurrent_select)
      }

      // Aspect Knowledge
      case "SA_87": {
        const valid_aspects = getAspectsWith3Gte10 (wiki) (hero)

        return liftM2 ((trad: Record<ActivatableDependent>) =>
                        filter ((e: Record<SelectOption>) =>
                                 pipe (
                                        SOA.id,
                                        ensure (isNumber),
                                        fmap (getTraditionOfAspect),
                                        bindF (getBlessedTradStrIdFromNumId),
                                        Maybe.elem (id (trad))
                                      )
                                      (e)
                                 && isNoRequiredOrActiveSelection (e)
                                 && notElem (SOA.id (e)) (valid_aspects)))
                      (getBlessedTradition (hero_specialAbilities (hero)))
                      (mcurrent_select)
      }

      // Adaption (Zauber)
      case "SA_231": {
        return fmap (filter ((e: Record<SelectOption>) =>
                              isNoRequiredOrActiveSelection (e)
                              && maybe (false)
                                       (pipe (value, gte (10)))
                                       (pipe (hero_spells, lookup (SOA.id (e))) (hero))))
                    (mcurrent_select)
      }

      // Tierwandlung
      case "SA_338": {
        const mactive_sels = getActiveSelectionsMaybe (mhero_entry)

        return fmap ((xs: List<Record<SelectOption>>) => {
                      if (isMaybeActive (mhero_entry)) {
                        const path =
                          pipe (
                                 active,
                                 listToMaybe,
                                 bindF (sid),
                                 findSelectOption (wiki_entry),
                                 bindF (SOA.gr)
                               )
                               (fromJust (mhero_entry))

                        const highest_level =
                          fmap (pipe (
                                 mapMaybe (pipe (
                                   Just as (x: string | number) => Maybe<string | number>,
                                   findSelectOption (wiki_entry),
                                   bindF (SOA.level)
                                 )),
                                 maximum,
                                 inc
                               ))
                               (mactive_sels)

                        return filter ((e: Record<SelectOption>) =>
                                          equals (path) (SOA.gr (e))
                                          && equals (SOA.level (e)) (highest_level))
                                      (xs)
                      }

                      return filter<Record<SelectOption>> (pipe (SOA.level, Maybe.elem (1)))
                                                          (xs)
                    })
                    (mcurrent_select)
      }

      // Spell Extensions
      case "SA_414":
      // Chant Extensions
      case "SA_663": {
        const getTargetHeroEntry = current_id === "SA_414"
          ? bindF (lookupF (hero_spells (hero)))
          : bindF (lookupF (hero_liturgicalChants (hero)))

        const getTargetWikiEntry:
          ((x: Maybe<string>) => Maybe<Record<Spell> | Record<LiturgicalChant>>) =
          current_id === "SA_414"
            ? bindF (lookupF (spells (wiki)))
            : bindF (lookupF (liturgicalChants (wiki)))

        return fmap (foldr ((e: Record<SelectOption>) => {
                             const mtarget_hero_entry = getTargetHeroEntry (SOA.target (e))
                             const mtarget_wiki_entry = getTargetWikiEntry (SOA.target (e))

                             if (
                               isNoRequiredOrActiveSelection (e)
                               && validatePrerequisites (wiki)
                                                        (hero)
                                                        (pipe (
                                                                SOA.prerequisites,
                                                                fromMaybe (List ())
                                                              )
                                                              (e))
                                                        (current_id)
                               && isJust (mtarget_wiki_entry)
                               && isJust (mtarget_hero_entry)
                               && value (fromJust (mtarget_hero_entry))
                                  >= maybe (0)
                                           (pipe (multiply (4), add (4)))
                                           (SOA.level (e))
                             ) {
                               const target_wiki_entry = fromJust (mtarget_wiki_entry)

                               return consF (
                                 set (nameL)
                                     (`${SpAL.name (target_wiki_entry)}: ${SOA.name (e)}`)
                                     (e)
                               )
                             }

                             return ident as ident<List<Record<SelectOption>>>
                           })
                           (List ()))
                    (mcurrent_select)
      }

      // Language Specializations
      case "SA_699": {
        return pipe (
                      specialAbilities,
                      lookup ("SA_29"),
                      bindF (select),
                      fmap (current_select => {
                             const available_langs =
                                     // Pair: fst = sid, snd = current_level
                               maybe (List<Pair<number, number>> ())
                                     (pipe (
                                       active,
                                       foldr ((obj: Record<ActiveObject>) =>
                                               pipe (
                                                      tier,
                                                      bindF (current_level =>
                                                              pipe (
                                                                     sid,
                                                                     bindF<string | number, number>
                                                                       (ensure (is3or4)),
                                                                     fmap (current_sid =>
                                                                            consF (Pair (
                                                                                    current_sid,
                                                                                    current_level
                                                                                  )))
                                                                   )
                                                                   (obj)),
                                                      fromMaybe (
                                                        ident as ident<List<Pair<number, number>>>
                                                      )
                                                    )
                                                    (obj)
                                             )
                                             (List ())
                                     ))
                                     (pipe (hero_specialAbilities, lookup ("SA_29")) (hero))

                             return foldr ((e: Record<SelectOption>) => {
                                            const lang =
                                              find ((l: Pair<number, number>) =>
                                                     fst (l) === SOA.id (e))
                                                   (available_langs)

                                            const first_for_language =
                                              fmap ((hero_entry: Record<ActivatableDependent>) =>
                                                     pipe (
                                                       active,
                                                       List.all (pipe (
                                                         sid,
                                                         Maybe.elem<string | number>
                                                           (id (hero_entry))
                                                       ))
                                                     )
                                                     (hero_entry))
                                                   (mhero_entry)

                                            if (isJust (lang) && or (first_for_language)) {
                                              const isMotherTongue =
                                                snd (fromJust (lang)) === 4

                                              if (isMotherTongue) {
                                                return consF (set (select_costL) (Just (0)) (e))
                                              }

                                              return consF (e)
                                            }

                                            return ident as ident<List<Record<SelectOption>>>
                                          }
                                        )
                                        (List ())
                                        (current_select)
                           })
                    )
                    (wiki)
      }

      default:
        return fmap (filter (isNotRequiredNotActive (mhero_entry)))
                    (mcurrent_select)
    }
  }

const isAddExistSkillSpecAllowed =
  (hero: HeroModelRecord) =>
  (counter: OrderedMap<string | number, List<string | number>>) =>
  (curr_select_id: string | number) =>
    pipe (
      ensure (isString),
      bindF (lookupF (hero_skills (hero))),
      bindF (skill => pipe (
                             lookupF (counter),
                             fmap (xs =>
                                    flength (xs) < 3
                                    && value (skill) >= (flength (xs) + 1) * 6)
                           )
                           (curr_select_id)),
      or
    )
    (curr_select_id)

const isAddNotExistSkillSpecAllowed =
  (hero: HeroModelRecord) =>
  (curr_select_id: string | number) =>
    pipe (
      ensure (isString),
      bindF (lookupF (hero_skills (hero))),
      fmap (skill => value (skill) >= 6),
      or
    )
    (curr_select_id)

const is3or4 = (x: string | number): x is number => x === 3 || x === 4

const modifyOtherOptions =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (ap: Record<AdventurePointsCategories>) =>
  (wiki_entry: Activatable) =>
  (mhero_entry: Maybe<Record<ActivatableDependent>>):
  Maybe<(x: Record<InactiveActivatable>) => Record<InactiveActivatable>> => {
    const current_id = id (wiki_entry)

    switch (current_id) {
      // Kleine Zauberauswahl
      case "DISADV_59": {
        return pipe (
                      countActiveSkillEntries ("spells"),
                      ensure (lt (3)),
                      fmap (pipe (subtract (3), Just, set (maxLevel)))
                    )
                    (hero)
      }

      // Craft Instruments
      case "SA_17": {
        return join (liftM2 (
                              (woodworking: Record<SkillDependent>) =>
                              (metalworking: Record<SkillDependent>) =>
                                value (woodworking) + value (metalworking) >= 12
                                  ? Just (ident)
                                  : Nothing
                            )
                            (pipe (hero_skills, lookup ("TAL_51")) (hero))
                            (pipe (hero_skills, lookup ("TAL_55")) (hero)))
      }

      // Hunter
      case "SA_18": {
        return pipe (
                      getAllEntriesByGroup (combatTechniques (wiki))
                                           (hero_combatTechniques (hero)),
                      filter (pipe (value, gte (10))),
                      flength,
                      ensure (gt (0)),
                      mapReplace (ident)
                    )
                    (2)
      }

      // Magical Traditions
      case "SA_70":
      case "SA_255":
      case "SA_345":
      case "SA_346":
      case "SA_676":
      case "SA_681": {
        return pipe (
                      hero_specialAbilities,
                      getMagicalTraditionsHeroEntries,
                      ensure (List.fnull),
                      mapReplace (ident)
                    )
                    (hero)
      }

      // Property Knowledge
      case "SA_72":
      // Aspect Knowledge
      case "SA_87": {
        return pipe (
                      cost,
                      bindF<number | List<number>, List<number>> (ensure (isList)),
                      bindF (costs => bindF (pipe (active, flength, subscript (costs)))
                                            (mhero_entry)),
                      fmap (pipe (Just, set (costL)))
                    )
                    (wiki_entry)
      }

      // Blessed Traditions
      case "SA_86":
      case "SA_682":
      case "SA_683":
      case "SA_684":
      case "SA_685":
      case "SA_686":
      case "SA_687":
      case "SA_688":
      case "SA_689":
      case "SA_690":
      case "SA_691":
      case "SA_692":
      case "SA_693":
      case "SA_694":
      case "SA_695":
      case "SA_696":
      case "SA_697":
      case "SA_698": {
        return pipe (
                      hero_specialAbilities,
                      getBlessedTradition,
                      mapReplace (ident)
                    )
                    (hero)
      }

      // Recherchegespür
      case "SA_533": {
        return pipe (
                      hero_specialAbilities,
                      lookup ("SA_531"),
                      fmap (active),
                      bindF (listToMaybe),
                      bindF (sid),
                      misStringM,
                      bindF (lookupF (skills (wiki))),
                      bindF (skill => pipe (
                                             bindF<number | List<number>, List<number>>
                                               (ensure (isList)),
                                             fmap (pipe (
                                                    map (add (ic (skill))),
                                                    Just,
                                                    set (costL)
                                                  ))
                                           )
                                           (cost (wiki_entry)))
                    )
                    (hero)
      }

      // Predigt der Gemeinschaft
      case "SA_544":
      // Predigt der Zuversicht
      case "SA_545":
      // Predigt des Gottvertrauens
      case "SA_546":
      // Predigt des Wohlgefallens
      case "SA_547":
      // Predigt wider Missgeschicke
      case "SA_548": {
        return mapReplace (ident)
                          (guard_ (() => {
                                    const isAdvActive =
                                      pipe (lookupF (hero_advantages (hero)), isMaybeActive)

                                    const max =
                                      getModifierByActiveLevel
                                        (Just (3))
                                        (lookup ("ADV_79") (hero_advantages (hero)))
                                        (lookup ("DISADV_72") (hero_disadvantages (hero)))

                                    const isLessThanMax =
                                      countActiveGroupEntries (wiki) (hero) (24) < max

                                    return (isAdvActive ("ADV_77") && isLessThanMax)
                                      || isAdvActive ("ADV_12")
                                  }))
      }

      // Vision der Bestimmung
      case "SA_549":
      // Vision der Entrückung
      case "SA_550":
      // Vision der Gottheit
      case "SA_551":
      // Vision des Schicksals
      case "SA_552":
      // Vision des Wahren Glaubens
      case "SA_553": {
        return mapReplace (ident)
                          (guard_ (() => {
                                    const isAdvActive =
                                      pipe (lookupF (hero_advantages (hero)), isMaybeActive)

                                    const max =
                                      getModifierByActiveLevel
                                        (Just (3))
                                        (lookup ("ADV_80") (hero_advantages (hero)))
                                        (lookup ("DISADV_73") (hero_disadvantages (hero)))

                                    const isLessThanMax =
                                      countActiveGroupEntries (wiki) (hero) (27) < max

                                    return (isAdvActive ("ADV_78") && isLessThanMax)
                                      || isAdvActive ("ADV_12")
                                  }))
      }

      // Dunkles Abbild der Bündnisgabe
      case "SA_667": {
        return pipe (
                      pact,
                      fmap (pipe (pact_level, Just, set (maxLevel)))
                    )
                    (hero)
      }

      // Tradition (Zauberbarde)
      case "SA_677":
      // Tradition (Zaubertänzer)
      case "SA_678":
      // Tradition (Intuitiver Zauberer)
      case "SA_679":
      // Tradition (Meistertalentierte)
      case "SA_680": {
        return mapReplace (ident)
                          (guard (spentOnMagicalAdvantages (ap) <= 25
                                  && spentOnMagicalDisadvantages (ap) <= 25
                                  && pipe_ (
                                      hero,
                                      hero_specialAbilities,
                                      getMagicalTraditionsHeroEntries,
                                      fnull
                                    )))
      }

      default:
        return Just (ident)
    }
  }

/**
 * Calculates whether an Activatable is valid to add or not and, if valid,
 * calculates and filters necessary properties and selection lists. Returns a
 * Maybe of the result or `undefined` if invalid.
 */
export const getInactiveView =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (adventure_points: Record<AdventurePointsCategories>) =>
  (validExtendedSpecialAbilities: List<string>) =>
  (wiki_entry: Activatable) =>
  (mhero_entry: Maybe<Record<ActivatableDependent>>): Maybe<Record<InactiveActivatable>> => {
    const current_id = id (wiki_entry)
    const current_prerequisites = prerequisites (wiki_entry)

    const max_level = isOrderedMap (current_prerequisites)
      ? validateLevel (wiki)
                      (hero)
                      (current_prerequisites)
                      (maybe<ActivatableDependent["dependencies"]> (List ())
                                                                   (dependencies)
                                                                   (mhero_entry))
                      (current_id)
      : Nothing

    const isNotValid = isAdditionDisabled (wiki)
                                          (hero)
                                          (validExtendedSpecialAbilities)
                                          (wiki_entry)
                                          (mhero_entry)
                                          (max_level)

    if (!isNotValid) {
      const specificSelections = modifySelectOptions (wiki) (hero) (wiki_entry) (mhero_entry)

      const mmodifyOtherOptions = modifyOtherOptions (wiki)
                                                     (hero)
                                                     (adventure_points)
                                                     (wiki_entry)
                                                     (mhero_entry)

      return liftM2 ((modify: ident<Record<InactiveActivatable>>) =>
                     (select_options: Maybe<List<Record<SelectOption>>>) =>
                       modify (InactiveActivatable ({
                                id: current_id,
                                name: SpAL.name (wiki_entry),
                                cost: cost (wiki_entry),
                                maxLevel: max_level,
                                heroEntry: mhero_entry,
                                wikiEntry: wiki_entry as Record<RecordI<Activatable>>,
                                selectOptions: fmapF (select_options)
                                                     (sortRecordsByName (id (l10n))),
                              })))
                    (mmodifyOtherOptions)
                    (ensure (Maybe.all (notNull)) (specificSelections))
    }

    return Nothing
  }