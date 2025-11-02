import { State } from "../state.js"
import { $$, ZOOM } from "../const.js"
import { canvas, zoomBar, zoomValue } from "../elements.js"

export const changeZoom = () => {
  const zoom = zoomBar.value
  
  const indexZoom =
    zoom >= 0 && zoom <= 21 ? 14
    : zoom >= 22 && zoom <= 35 ? 28
    : zoom >= 36 && zoom <= 49 ? 42
    : zoom >= 50 && zoom <= 63 ? 56
    : zoom >= 64 && zoom <= 75 ? 70
    : zoom >= 76 && zoom <= 85 ? 80
    : zoom >= 86 && zoom <= 95 ? 90
    : zoom >= 96 && zoom <= 105 ? 100
    : zoom >= 106 && zoom <= 115 ? 110
    : zoom >= 116 && zoom <= 125 ? 120
    : zoom >= 126 && zoom <= 135 ? 130
    : 140
  
  zoomBar.value = indexZoom
  
  const zoomScale = ZOOM.get(indexZoom)
  zoomValue.innerText = zoomScale + "%"
  canvas.style.width = Math.round(State.canvasWidth / 100 * zoomScale) + "px"
  
  $$('#rulerX .rulerNumber').forEach((rulerNumber, i) => {
    rulerNumber.innerText = Math.round(100 / zoomScale * (100 * i))
  })
  
  $$('#rulerY .rulerNumber').forEach((rulerNumber, i) => {
    rulerNumber.innerText = Math.round(100 / zoomScale * (100 * i))
  })
}