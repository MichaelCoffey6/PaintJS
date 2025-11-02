import { State } from "../state.js"
import { undoBtn, redoBtn, canvas, ctx } from "../elements.js"

export const undoDraw = () => {
  if (State.historyIndex === 0) return
  
  const historyIndex = --State.historyIndex
  const data = State.history[historyIndex]
  const { width, height } = data
  canvas.width = State.canvasWidth = width
  canvas.height = State.canvasHeight = height
  redoBtn.disabled = false

  ctx.putImageData(State.cleanImgData = data, 0, 0)
  
  if (historyIndex === 0) undoBtn.disabled = true
}

export const redoDraw = () => {
  if (State.historyIndex === State.history.length - 1) return
  
  const historyIndex = ++State.historyIndex
  const data = State.history[historyIndex]
  const { width, height } = data
  canvas.width = State.canvasWidth = width
  canvas.height = State.canvasHeight = height
  undoBtn.disabled = false

  ctx.putImageData(State.cleanImgData = data, 0, 0)
  
  if (historyIndex === State.history.length - 1) redoBtn.disabled = true
}