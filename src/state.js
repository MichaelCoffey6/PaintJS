import { MODES } from "./const.js"

export const State = {
  fileName: '',
  currentPictureId: '',
  currentExtSection: null,
  currentExtButton: null,
  canvasWidth: 300,
  canvasHeight: 150,
  cleanImgData: new ImageData(1, 1),
  pointerType: null,
  pointerDown: false,
  pointerMove: false,
  historyIndex: -1,
  history: [],
  recentPicturesArr: [],
  mode: MODES.draw,
  widthIsPair: 1 
}

const nimg1 = new ImageData(1, 1)
Object.assign(nimg1.data, [
  255, 0, 0, 255
])
const nimg2 = new ImageData(1, 1)
Object.assign(nimg2.data, [
  0, 255, 0, 255
])

State.recentPicturesArr = [
  {
    imgData: nimg1, 
    fileName: 'Test1.png',
    recentPictureId: crypto.randomUUID()
  },
  {
    imgData: nimg2, 
    fileName: 'Test2.png',
    recentPictureId: crypto.randomUUID()
  }
]