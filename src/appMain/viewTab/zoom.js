import { arrZOOM } from "../../const.js"
import { changeZoom } from "../../appFooter/zoomBar.js"
import { zoomBar } from "../../elements.js"

export const zoomIn = () => {
  const currentZoom = +zoomBar.value
  const nextIndex = arrZOOM.findIndex(([ key ]) => key === currentZoom) + 1
  
  if (nextIndex >= arrZOOM.length) return
  
  zoomBar.value = arrZOOM[ nextIndex ][0]
  changeZoom()
}

export const zoomOut = () => {
  const currentZoom = +zoomBar.value
  const nextIndex = arrZOOM.findIndex(([ key ]) => key === currentZoom) - 1
  
  if (nextIndex < 0) return
  
  zoomBar.value = arrZOOM[ nextIndex ][0]
  changeZoom()
}

export const zoom100 = () => {
  zoomBar.value = 70
  changeZoom()
}