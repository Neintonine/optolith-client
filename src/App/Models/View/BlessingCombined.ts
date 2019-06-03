import { fromDefault, Record } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { Blessing } from "../Wiki/Blessing";
import { IsActive } from "./viewTypeHelpers";

export interface BlessingCombined extends IsActive {
  wikiEntry: Record<Blessing>
}

export const BlessingCombined =
  fromDefault<BlessingCombined> ({
    wikiEntry: Blessing .default,
    active: false,
  })

export const BlessingCombinedA_ = {
  name: pipe (BlessingCombined.A.wikiEntry, Blessing.A.name),
}