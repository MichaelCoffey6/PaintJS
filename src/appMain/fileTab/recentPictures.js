import { State } from "../../state.js"
import { titleInp, recentPicturesList, saveBtn, ctx, canvas, fileTabChk } from "../../elements.js"
import { newHistoryChange } from "../../history.js"
import { changeZoom } from "../../appFooter/zoomBar.js"

//let db = {}

const getDB = async () => {
  const { promise, resolve, reject } = Promise.withResolvers()
  const openRequest = indexedDB.open('MichaelCoffey-PaintJS-DB', 1)

  openRequest.onupgradeneeded = () => {
    const db = openRequest.result

    if (db.objectStoreNames.contains('recentPicturesArr')) return

    db.createObjectStore('recentPicturesArr', { keyPath: 'index' })
  }

  openRequest.onsuccess = event => {
    const dbTemp = openRequest.result

    dbTemp.onversionchange = async () => {
      dbTemp.close()
      alert('recent pictures list updated')
      db = await getDB()
      updateArray()
    }

    resolve(dbTemp)
  }

  openRequest.onerror = () => reject(openRequest.error)

  return promise
}

const updateArray = async () => {
  const transaction = db.transaction('recentPicturesArr', 'readwrite'); // (1)
  const recentPicturesArr = transaction.objectStore('recentPicturesArr'); // (2)
  const len = await new Promise((res, rej) => {
    const len = recentPicturesArr.count()
    len.onsuccess = () => res(len.result)
    len.onerror = () => rej(len.error)
  })

  if (len === 0) {
    State.recentPicturesArr.forEach(({ fileName, imgData }, index) => {
      const { width, height, data } = imgData
      const imageData = {
        width, 
        height,
        fileName,
        data: Array.from(data)
      }
      
      recentPicturesArr.add({ index, imageData })
    })
    
    recentPicturesArr.getAll().onsuccess = evt => cl(evt.target.result)
  } else {
    recentPicturesArr.getAll().onsuccess = evt => {
      const { result } = evt.target
      
      cl(result)
      State.recentPicturesArr = result.map(({ imageData }) => {
        const { width, height, data, fileName } = imageData
        const imgData = new ImageData(width, height)
        
        Object.assign(imgData.data, data)
        
        return { imgData, fileName }
      })
    }
  }

}

const save = () => {
  const { fileName, canvasWidth, canvasHeight } = State
  const transaction = db.transaction('recentPicturesArr', 'readwrite')
  const recentPicturesArr = transaction.objectStore('recentPicturesArr')
  const imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
  
  State.recentPicturesArr.unshift({ imgData, fileName })
  State.recentPicturesArr.splice(0, 8)
  
  recentPicturesArr.clear()
  updateArray()
}

export const openRecentPicture = ({ target }) => {
  if (target.parentElement !== recentPicturesList) return
  
  fileTabChk.checked = false
  
  const { recentPictureId } = target.dataset
  const recentPictureIndex = State.recentPicturesArr.findIndex(item => {
    const { recentPictureId: id } = item
    return recentPictureId === id
  })
  
  const { imgData, fileName } = State.recentPicturesArr[recentPictureIndex]
  const { width, height } = imgData
  
  State.recentPicturesArr.splice(recentPictureIndex, 1)
  State.recentPicturesArr.unshift({ imgData, fileName, recentPictureId })
  State.canvasWidth = canvas.width = width
  State.canvasHeight = canvas.height = height
  State.currentPictureId = recentPictureId
  State.cleanImgData = imgData
  State.fileName = titleInp.value = fileName
  State.historyIndex = -1
  State.history = []
  
  recentPicturesList.replaceChildren.apply(
    recentPicturesList,
    State.recentPicturesArr.map(({ imgData, fileName, recentPictureId }) => {
      const li = document.createElement('li')
      li.innerText = fileName
      li.dataset.recentPictureId = recentPictureId
      return li
    })
  )
  
  ctx.putImageData(imgData, 0, 0)
  changeZoom()
  newHistoryChange()
}

window.deleteDB = () => indexedDB.deleteDatabase('MichaelCoffey-PaintJS-DB')

//let db = await getDB()
//updateArray()