import { State } from "./state.js"
import { canvas } from "./elements.js"

export const getOffset = event => {
  const { x, y, width, height } = canvas.getBoundingClientRect()
  const { canvasWidth, canvasHeight } = State
  const { clientX, clientY } = event instanceof TouchEvent
    ? event.changedTouches[0]
    : event
  
  const offsetX = Math.round(canvasWidth / width * (clientX - x))
  const offsetY = Math.round(canvasHeight / height * (clientY - y))
  
  return { offsetX, offsetY }
}

export const str2Size = str => {
  const n = new TextEncoder().encode(str).length
  if (n === 0) return "0b"
  const k = Math.floor((Math.log2(n) / 10))
  const rank = ('KMGT'[k - 1] ?? '') + 'b'
  const count = Math.floor(n / Math.pow(1024, k))
  return count + rank
}

export const desfase = (offsetX, offsetY, lastX, lastY) => {
  const b = offsetX - lastX
  const h = offsetY - lastY
  const hip = Math.hypot(b, h)
  
  const x = (h / hip * 0.5)
  const y = (b / hip * 0.5)
  
  return { x, y }
}