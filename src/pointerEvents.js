import { State } from "./state.js"
import { canvas, ctx } from "./elements.js"
import { getOffset, desfase } from "./utils.js"
import { newHistoryChange } from "./history.js"

let lastX = 0, lastY = 0
let startX = 0, startY = 0

export const onPointerDown = event => {
  const { pointerType } = event
  const { offsetX, offsetY } = getOffset(event)
  
  State.pointerType = pointerType === "touch" ? TouchEvent : MouseEvent
  State.pointerDown = true
  
  lastX = startX = offsetX
  lastY = startY = offsetY
}

export const onPointerMove = event => {
  const { constructor } = event
  const { pointerType, pointerDown, widthIsPair } = State
  
  if (constructor !== pointerType) return
  if (!pointerDown) return
  
  State.pointerMove = true
  
  const { offsetX, offsetY } = getOffset(event)
  const { x = 0, y = 0 } = widthIsPair ? desfase(offsetX, offsetY, lastX, lastY) : {}
  
  ctx.beginPath()
  ctx.moveTo(lastX - x, lastY - y)
  ctx.lineTo(offsetX - x, offsetY - y)
  ctx.stroke()
  
  lastX = offsetX
  lastY = offsetY
}

export const onPointerUp = event => {
  const { constructor } = event
  const { pointerType, pointerDown, pointerMove, widthIsPair } = State
  
  if (constructor !== pointerType) return
  if (!pointerDown) return
  
  if (!pointerMove) {
    const { offsetX, offsetY } = getOffset(event)
    ctx.fillRect(offsetX, offsetY, 1, 1)
  }
  
  newHistoryChange()

  State.pointerDown = false
  State.pointerMove = false
}