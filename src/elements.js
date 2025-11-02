import { $, $$ } from "./const.js"

export const { 
  fileTabChk,
  saveBtn,
  titleInp,
  undoBtn, 
  redoBtn,
  canvas, 
  scrollLeftBtn,
  scrollCont, 
  scrollRightBtn,
  zoom100Btn,
  zoomInBarBtn, 
  zoomInBtn,
  zoomBar,
  zoomOutBtn, 
  zoomOutBarBtn,
  zoomValue,
  colorPickerCont,
  rulerSectionTmpl,
  recentPicturesList
} = window

export const ctx = canvas.getContext('2d')

export const actionSections = $$('#homeSections > section, #homeSections > div[role=dialog]')
export const tabsInp = $$('[name=actionSectionInp]')

export const clipboardBigBtn = $('#clipboardSection .bigBtn')
export const imageBigBtn = $('#imageSection .bigBtn')

export const clipboardExtOpts = $('#clipboardSection .extendOpts')
export const imageExtOpts = $('#imageSection .bigBtn .extendOpts')

export const clipboardExtAct = $('#clipboardSection .extendAction')
export const imageExtAct = $('#imageSection .bigBtn .extendAction')