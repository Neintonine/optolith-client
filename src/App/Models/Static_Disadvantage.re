// type t = {
//   id: int,
//   name: string,
//   cost: Advantage.cost,
//   noMaxAPInfluence: bool,
//   isExclusiveToArcaneSpellworks: bool,
//   input: Maybe.t(string),
//   max: Maybe.t(int),
//   levels: Maybe.t(int),
//   select: Maybe.t(list(SelectOption.t)),
//   rules: string,
//   range: Maybe.t(string),
//   actions: Maybe.t(string),
//   prerequisites: Prerequisites.tWithLevelDisAdv,
//   prerequisitesText: Maybe.t(string),
//   prerequisitesTextIndex: Maybe.t(Prerequisites.tIndexWithLevel),
//   prerequisitesTextStart: Maybe.t(string),
//   prerequisitesTextEnd: Maybe.t(string),
//   apValue: Maybe.t(string),
//   apValueAppend: Maybe.t(string),
//   gr: int,
//   src: list(SourceRef.t),
//   errata: list(Erratum.t),
// };

module Decode = {
  open Json.Decode;
  open JsonStrict;
};