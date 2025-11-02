import { State } from "./state.js"
import { ctx, undoBtn, redoBtn } from "./elements.js"

export const newHistoryChange = () => {
  const { canvasWidth, canvasHeight } = State
  const historyIndex = ++State.historyIndex
  
  undoBtn.disabled = historyIndex === 0 ? true : false
  redoBtn.disabled = true
  
  State.cleanImgData = State.history[historyIndex] = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
  State.history = State.history.slice(0, historyIndex + 1)
  //State.pastingImg = false
  //State.pointerMove = false
  
  cl(State.history)
}