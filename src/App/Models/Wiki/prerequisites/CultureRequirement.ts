import { equals } from "../../../../Data/Eq"
import { List } from "../../../../Data/List"
import { fromDefault, Record } from "../../../../Data/Record"
import { pipe } from "../../../Utilities/pipe"
import { AllRequirementObjects } from "../wikiTypeHelpers"
import { RequireActivatable } from "./ActivatableRequirement"

export interface CultureRequirement {
  "@@name": "CultureRequirement"
  id: "CULTURE"
  value: string | List<string>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CultureRequirement =
  fromDefault ("CultureRequirement")
              <CultureRequirement> ({
                id: "CULTURE",
                value: "",
              })

export const isCultureRequirement =
  pipe (RequireActivatable.AL.id, equals<string | List<string>> ("CULTURE")) as unknown as
    (req: AllRequirementObjects) => req is Record<CultureRequirement>
