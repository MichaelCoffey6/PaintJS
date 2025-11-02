import "./src/fixFont.js"

import "./src/appHeader/titlePolyfill.js"
import "./src/appMain/homeTab/ColorPicker.js"
import "./src/appMain/workspace/rulers.js"


import "./src/listeners.js"

import { State } from "./src/state.js"
import { canvas, recentPicturesList } from "./src/elements.js"
import { newHistoryChange } from "./src/history.js"

State.canvasWidth = canvas.width = 40
State.canvasHeight = canvas.height = 40

newHistoryChange()

recentPicturesList.replaceChildren.apply(
  recentPicturesList,
  State.recentPicturesArr.map(({ imgData, fileName, recentPictureId }) => {
    const li = document.createElement('li')
    li.innerText = fileName
    li.dataset.recentPictureId = recentPictureId
    return li
  })
)