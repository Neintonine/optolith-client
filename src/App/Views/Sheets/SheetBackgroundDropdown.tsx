import React, { ChangeEvent, useState } from "react"
import { List } from "../../../Data/List"
import { Just } from "../../../Data/Maybe"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { Dialog } from "../Universal/Dialog"
import { Dropdown } from "../Universal/Dropdown"
import * as backgrounds from "./backgrounds.json"

export interface SheetBackgroundDropdownProps {
  value: SheetBackground
  setValue (newButton: SheetBackground): void
}

export interface SheetBackground {
  dropdownValue: string
  getElement (): JSX.Element|null
}

export function getImageElement (value: string): () => JSX.Element|null {
  if (value === "") {
    return () => null
  }

  return () => (
    <img className="background" src={`images/sheet-backgrounds/${value}`} aria-hidden />
  )
}

export const SheetBackgroundDropdown: React.FC<SheetBackgroundDropdownProps> = props => {
  const {
    value,
    setValue,
  } = props

  const [ openDialog, setOpenDialog ] = useState<boolean> (false)
  const [ customImage, setCustomImage ] = useState<File> ()

  const backgroundList = [
    DropdownOption ({
      name: "None",
      id: Just (""),
    }),
    DropdownOption ({
      name: "Custom",
      id: Just ("custom"),
    })
  ]
  for (const [ k, v ] of Object.entries (backgrounds)) {
    if (k === "default") {
      continue
    }

    backgroundList.push (DropdownOption ({
        id: Just (v),
        name: k,
      }))
  }

  const closeDialog = () => {
    setOpenDialog (false)
  }

  const applyCustomBackground = () => {
    setValue ({
      dropdownValue: "custom",
      getElement (): JSX.Element | null {
        return (
          <img className="background" src={customImage?.path} aria-hidden />
        )
      },
    })
  }

  const handleCustomImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return
    }

    setCustomImage (event.target.files[0])
  }

  return (
    <div>
      <Dropdown
        options={List (...backgroundList)}
        value={Just (value.dropdownValue)}
        label="Background"
        onChangeJust={o => {
          const changedVal = o.toString ()

          if (changedVal !== "custom") {
            setValue ({
              dropdownValue: changedVal,
              getElement: getImageElement (changedVal),
            })

            return
          }

          // Open Dialog
          setOpenDialog (true)
        }}
        />

      <Dialog
        id="setCustomBackground"
        close={closeDialog}
        isOpen={openDialog}
        title="Apply custom background"
        buttons={[
          {
            autoWidth: true,
            label: "Apply",
            disabled: false,
            onClick: applyCustomBackground,
          },
        ]}
        >
        <p>To make sure the background is displayed probably, make sure the following guidance is followed.</p>
        <ol>
          <li>Make sure the image has an aspect ratio of 1:1.41.</li>
          <li>Its recommend to at least have a resolution of 1241x1754px.</li>
        </ol>

        <input
          type="file"
          accept={"image/*"}
          onChange={handleCustomImageChange}
          />
      </Dialog>
    </div>
  )
}
