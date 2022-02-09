import { Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault, makeLenses } from "../../../Data/Record"

export interface ActivatableCombinedName {
  "@@name": "ActivatableCombinedName"
  name: string
  baseName: string
  addName: Maybe<string>
  levelName: Maybe<string>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActivatableCombinedName =
  fromDefault ("ActivatableCombinedName")
              <ActivatableCombinedName> ({
                name: "",
                baseName: "",
                addName: Nothing,
                levelName: Nothing,
              })

export const ActivatableCombinedNameL = makeLenses (ActivatableCombinedName)
