import { rulerSectionTmpl } from "../../elements.js"
import { $ } from "../../const.js"

const rulerScale = 100
workspace.style.setProperty('--ruler-scale', `${rulerScale}px`)

const getRulerSections = rulerSectionsLen => {
  const rulerSections = []

  for (let i = 0; i < rulerSectionsLen; i++) {
    const rulerSeparator = document.createElement('span')
    const rulerSection = rulerSectionTmpl.content.cloneNode(true)
    const rulerNumber = $('.rulerNumber', rulerSection)

    rulerNumber.innerText = i * rulerScale
    rulerSeparator.classList.add('rulerSeparator')
    rulerSections.push(rulerSeparator, rulerSection)
  }

  return rulerSections
}

const setRulerSections = () => {
  const rulerSectionsX = getRulerSections(workspace.clientWidth / rulerScale)
  const rulerSectionsY = getRulerSections(workspace.clientHeight / rulerScale)
  rulerX.replaceChildren.apply(rulerX, rulerSectionsX)
  rulerY.replaceChildren.apply(rulerY, rulerSectionsY)
}

setRulerSections()