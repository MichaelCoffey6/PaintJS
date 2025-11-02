import { recentPicturesList, undoBtn, redoBtn, tabsInp, canvas, scrollLeftBtn, scrollCont, scrollRightBtn, zoom100Btn, zoomInBarBtn, zoomInBtn, zoomBar, zoomOutBtn, zoomOutBarBtn } from "./elements.js"
import { undoDraw, redoDraw } from "./appHeader/undoAndRedo.js"
import { openRecentPicture } from "./appMain/fileTab/recentPictures.js"
import { onScrollSections } from "./appMain/homeTab/scrollSections.js"
import { cancelColorPicker } from "./appMain/homeTab/colors.js"
import { zoomIn, zoomOut, zoom100 } from "./appMain/viewTab/zoom.js"
import { changeZoom } from "./appFooter/zoomBar.js"
import { onPointerDown, onPointerMove, onPointerUp } from "./pointerEvents.js"

window.addEventListener('load', () => onScrollSections({ target: scrollCont }))

colorPicker.addEventListener('cancel', cancelColorPicker)

undoBtn.addEventListener('click', undoDraw)
redoBtn.addEventListener('click', redoDraw)

recentPicturesList.addEventListener('click', openRecentPicture)

tabsInp.forEach(inp => inp.addEventListener('change', () => onScrollSections({ target: scrollCont })))
scrollRightBtn.addEventListener('click', () => scrollCont.scroll(scrollCont.scrollWidth, 0))
scrollLeftBtn.addEventListener('click', () => scrollCont.scroll(0, 0))
scrollCont.addEventListener('scroll', onScrollSections)

zoomInBtn.addEventListener('click', zoomIn)
zoomOutBtn.addEventListener('click', zoomOut)
zoom100Btn.addEventListener('click', zoom100)

zoomInBarBtn.addEventListener('click', zoomIn)
zoomBar.addEventListener('input', changeZoom)
zoomOutBarBtn.addEventListener('click', zoomOut)

canvas.addEventListener('pointerdown', onPointerDown)
canvas.addEventListener('touchmove', onPointerMove)
canvas.addEventListener('mousemove', onPointerMove)
canvas.addEventListener('touchend', onPointerUp)
canvas.addEventListener('mouseup', onPointerUp)