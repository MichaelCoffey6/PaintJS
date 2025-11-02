customElements.define('color-picker', class ColorPicker extends HTMLElement {
  #connected = false
  #inChangeWidthProp = false
  #width = 360
  #hex = "#ff0000"
  #hsl = { h: 0, s: 100, l: 50 }
  #pixel = [ 255, 0, 0 ]
  #pixelXY = { x: 0, y: 0, z: 0 }
  #events = new Map()
  #customColors = []
  
  get RGB () {
    const [ r, g, b, a = 1 ] = this.#pixel
    return `rgba(${ r }, ${ g }, ${ b }, ${ a })`
  }
  get RGBv () {
    const [ r, g, b ] = this.#pixel
    return { r, g, b }
  }
  
  get HSL () {
    const { h, s, l, a = 1 } = this.#hsl
    return `hsla(${ h }, ${ s }%, ${ l }%, ${ a })`
  }
  get HSLv () {
    return this.#hsl
  }
  
  set HEX (newValue) {
    this.#hex = newValue
  }
  get HEX () {
    return this.#hex
  }
  
  set width (newValue) {
    this.#inChangeWidthProp = true
    this.setAttribute('width', String(newValue))
    this.#inChangeWidthProp = false
    
    this.#width = +newValue
    
    this.script(newValue)
  }
  get width () {
    return this.#width
  }
  
  callback (fn, type) {
    fn.call(this, {
      target: this,
      rgb: this.RGB, 
      hsl: this.HSL,
      hex: this.HEX,
      hslValues: this.HSLv,
      rgbValues: this.RGBv,
      type
    })
  }
  
  on (type, fn) {
    const callback = () => this.callback(fn, type)
    this.#events.set(fn, callback)
    this.addEventListener(type, this.#events.get(fn))
  }
  off (type, fn) {
    this.removeEventListener(type, this.#events.get(fn))
    this.#events.delete(fn)
  }
  
  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'width' && !this.#inChangeWidthProp) {
      this.#width = newValue
      
      this.script(newValue)
    }
  }
  
  connectedCallback () {
    this.#width = +this.getAttribute('width') || this.#width
    
    this.script(this.#width)
  }
  
  get styles () { 
    const { width, value } = this
    
    return (`<style>
  @scope {
    :host {
      display: inline-block
    }
    
    *, button, input {
      font-family: inherit, Arial, system-ui;
    }
    
    #colorPicker {
      --totalWidth: ${ width }px;
      --width: calc(40 * var(--totalWidth) / 101);
      --twoCols: calc(var(--width) + (var(--width) / 10) + (var(--width) / 16));
      --theme: dark;
      
      display: grid;
      width: var(--totalWidth);
      grid-template-areas: 'pallette picker' 'pallette values';
      grid-template-columns: 1fr 1fr;
      gap: calc(var(--width) / 10);
      background-color: #eee;
      box-sizing: border-box;
      padding: calc(var(--width) / 20);
    }
    
    #pallette {
      grid-area: pallette;
      height: 100%;
      display: flex;
      flex-flow: column wrap;
      grid-template-areas: 'basicColors' 'customColors' 'extitBtns';
      justify-content: space-between;
      font-size: calc(var(--width) / 15);
    }
    
    #basicColors {
      grid-area: basicColors;
      width: 100%;
      height: fit-content;
    }
    
    #customColors {
      grid-area: customColors;
      width: 100%;
      height: fit-content;
      padding: 0;
    }
    
    #customColors p, #basicColors p {
      width: 100%;
      margin: 0;
      padding: 0;
    }
    
    #customColors div, #basicColors div {
      width: 100%;
      display: flex;
      flex-flow: row wrap;
      gap: calc(var(--width) / 20);
      padding: calc(var(--width) / 40) 0;
      justify-content: end
    }
    
    #customColors .customColors, #basicColors .basicColors {
      display: inline-block;
      width: calc((var(--twoCols) / 8) - (var(--width) / 20 / 8 * 7) - (var(--width) / 20 / 8));
      height: calc((var(--twoCols) / 8) - (var(--width) / 20) - (var(--width) / 20 / 8));
      background-color: var(--color);
      /*background-color: #fff;*/
      box-shadow: 0 0 0 0.5px grey;
    }
    
    #extitBtns {
      grid-area: extitBtns;
      height: fit-content;
      text-align: right;
      display: flex;
      flex-flow: row wrap;
      padding: 0;
      gap: calc(var(--width) / 70) calc(var(--width) / 20);
    }
    
    #extitBtns button {
      font-family: inherit;
      margin: 0;
      border-radius: 0;
      border-width: 1px;
      font-size: calc(var(--width) / 15);
    }
    
    #defCustom {
      width: 100%
    }
    
    #picker {
      grid-area: picker;
      width: 100%;
      display: flex;
      gap: calc(var(--width) / 10);
      padding: 0;
      flex-flow: row wrap;
    }
    
    #colorPickerCanvas {
      width: var(--width);
      height: var(--width);
      padding: 0;
      border: 0;
      box-shadow: 0 0 0 0.5px grey;
      display: inline-block;
      overflow: hidden;
      position: relative;
      background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
    }
    
    #colorPickerCanvas::before {
      position: absolute;
      z-index: 0;
      left: 0;
      top: 0;
      content: '';
      width: 100%;
      height: 100%;
      display: block;
      background: linear-gradient(to bottom, #0000, #808080);
    }
    
    #pointerCol {
      position: absolute;
      z-index: 1;
      top: calc(var(--width) / 20 / 2 * -1);
      left: calc(var(--width) / 20 / 2 * -1);
      width: calc(var(--width) / 20);
      height: calc(var(--width) / 20);
      box-shadow: 0 0 0 calc(var(--width) / 70) #000;
      border-radius: 50%;
      pointer-events: none;
    }
    
    #pickerCanvas {
      margin: 0px;
    }
    
    #luminescent {
      width: calc(var(--width) / 16);
      height: var(--width);
      border: 0;
      margin: 0;
      padding: 0;
      box-shadow: 0 0 0 0.5px grey;
      display: inline-block;
      position: relative;
      background: linear-gradient(to bottom, #fff, #f00, #000);
    }
    
    #lumCanvas {
      width: 100%;
      height: var(--width);
      z-index: 0;
      top: 0;
      display: none
    }
    
    #pointerLum {
      position: absolute;
      z-index: 1;
      top: calc(50% - (var(--width) / 30));
      left: 100%;
      width: 0; 
      height: 0; 
      border-top: calc(var(--width) / 30) solid transparent;
      border-bottom: calc(var(--width) / 30) solid transparent;
      border-right: calc(var(--width) / 30) solid black;
      pointer-events: none;
    }
    
    #values {
      grid-area: values;
      width: 100%;
      height: 100%;
      display: grid;
      flex-flow: row wrap;
      grid-template-areas: 'currentColorPrev inputs' 'btnAddColor btnAddColor';
      grid-template-columns: calc(var(--width) / 3) 1fr;
      gap: calc(var(--width) / 70) 0;
    }
    
    #currentColorPrev {
      grid-area: currentColorPrev;
      width: calc(var(--width) / 3);
      font-size: calc(var(--width) / 15);
    }
    
    #currentColorPrev span {
      width: 100%;
      white-space: nowrap;
    }
    
    #currentColor {
      width: calc(var(--width) / 3);
      height: calc(var(--width) / 5);
      background-color: var(--value);
      box-shadow: 0 0 0 0.5px grey;
    }
    
    #inputs {
      grid-area: inputs;
      display: flex;
      flex-flow: row wrap;
      gap: calc(var(--width) / 70) 0;
      font-size: calc(var(--width) / 15);
    }
    
    #inputs label {
      width: 50%;
      display: flex;
      gap: 0 calc(var(--width) / 70);
      justify-content: end;
      align-items: center;
    }
    
    #inputs input {
      all: unset;
      padding: 0 calc(var(--width) / 90);
      width: 2.5em;
      height: calc(var(--width) / 8);
      border: 1px solid grey;
      box-sizing: border-box;
      font-size: calc(var(--width) / 15);
    }
    
    #btnAddColor {
      font-family: inherit;
      grid-area: btnAddColor;
      width: 100%;
      border-radius: 0;
      border-width: 1px;
      font-size: calc(var(--width) / 15);
    }
  }
</style>`)
  }
  get html () {
    const basicColorsArr = ['hsl(0,100%,75%)', 'hsl(60,100%,75%)', 'hsl(120,100%,75%)', 'hsl(150,100%,50%)', 'hsl(180,100%,75%)', 'hsl(210,100%,50%)', 'hsl(330,100%,75%)', 'hsl(300,100%,75%)', 'hsl(0,100%,50%)', 'hsl(60,100%,50%)', 'hsl(90,100%,50%)', 'hsl(135,100%,50%)', 'hsl(180,100%,50%)', 'hsl(200,60%,38%)', 'hsl(240,34%,63%)', 'hsl(300,100%,50%)', 'hsl(0,20%,38%)', 'hsl(20,100%,63%)', 'hsl(120,100%,50%)', 'hsl(180,34%,25%)', 'hsl(210,34%,25%)', 'hsl(240,100%,75%)', 'hsl(330,34%,25%)', 'hsl(330,100%,50%)', 'hsl(0,34%,25%)', 'hsl(30,100%,50%)', 'hsl(120,34%,25%)', 'hsl(150,34%,25%)', 'hsl(240,100%,50%)', 'hsl(240,46%,31%)', 'hsl(300,34%,25%)', 'hsl(270,100%,50%)', 'hsl(0,100%,13%)', 'hsl(30,34%,25%)', 'hsl(120,100%,13%)', 'hsl(180,100%,13%)', 'hsl(240,34%,25%)', 'hsl(240,100%,13%)', 'hsl(300,100%,13%)', 'hsl(270,34%,25%)', 'hsl(0,0%,0%)', 'hsl(60,34%,25%)', 'hsl(60,20%,38%)', 'hsl(0,0%,50%)', 'hsl(180,20%,38%)', 'hsl(0,0%,75%)', 'hsl(300,100%,13%)', 'hsl(0,0%,100%)']
    let basicColors = ""
    let customColors = ""
    
    for (let ind = 0; ind < (8 * 6); ind++) {
      basicColors += `<span class="basicColors" style="--color: ${ basicColorsArr[ind] }"></span>`
      if (ind < (8 * 2)) customColors += `<span class="customColors" style="--color: ${ this.#customColors[ind] || '#fff' }"></span>`
    }
    
    return (`
  <div id="colorPicker">
    <section id="pallette">
      <article id="basicColors">
        <p>Basic colors:</p>
        <div>${ basicColors }</div>
      </article>
      <article id="customColors">
        <p>Custom colors:</p>
        <div>${ customColors }</div>
      </article>
      <article id="extitBtns">
        <button id="defCustom" disabled>Define custom colors</button>
        <button id="acceptBtn">Accept</button>
        <button id="cancelBtn">Cancel</button>
      </article>
    </section>
    <section id="picker" style="">
      <article id="colorPickerCanvas">
        <div id="pointerCol"></div>
      </article>
      <article id="luminescent">
        <div id="pointerLum"></div>
      </article>
    </section>
    <section id="values">
      <article id="currentColorPrev" style="">
        <div id="currentColor"></div>
        <span>Solid Color</span>
      </article>
      <article id="inputs">
        <label for="Hue">
          Hue <input type="number" name=HSL id=Hue max=255 min=0 />
        </label>
        
        <label for="Red">
          Red <input type="number" name=RGB id=Red max=255 min=0 />
        </label>
        
        <label for="Sat">
          Sat <input type="number" name=HSL id=Sat max=255 min=0 />
        </label>
        
        <label for="Green">
          Green <input type="number" name=RGB id=Green max=255 min=0 />
        </label>
        
        <label for="Lum">
          Lum <input type="number" name=HSL id=Lum max=255 min=0 />
        </label>
        
        <label for="Blue">
          Blue <input type="number" name=RGB id=Blue max=255 min=0 />
        </label>
      </article>
      <button id="btnAddColor">Add to custom colors</button>
    </section>
  </div>`)
  }
  script (changeWidth) {
    const { shadowRoot } = this
    const { HSLtoXYZ, HSLtoRGB, XYZtoHSL, RGBtoHEX, RGBtoHSL } = ColorPicker.conversions
    
    const $ = sel => shadowRoot.querySelector(sel)
    const $$ = sel => shadowRoot.querySelectorAll(sel)
    const cl = (...log) => console.log(...log)
    
    const container = $('#colorPicker')
    const hueSat = $('#colorPickerCanvas')
    
    container.style.setProperty('--totalWidth', `${changeWidth}px`)
    
    const width = parseFloat(getComputedStyle(hueSat).getPropertyValue('width'))
    
    const { h, s, l } = this.#hsl
    this.#pixelXY = HSLtoXYZ(h, s, l, width)
    
    const basicColors = $$('.basicColors')
    const customColors = $$('.customColors')
    const currentColor = $('#currentColor')
    const inputsRGB_HSL = $$('#inputs input')
    const inpR = $('#Red')
    const inpG = $('#Green')
    const inpB = $('#Blue')
    const inpH = $('#Hue')
    const inpS = $('#Sat')
    const inpL = $('#Lum')
    const pointerLum = $('#pointerLum')
    const pointerCol = $('#pointerCol')
    const luminescent = $('#luminescent')
    const btnAddColor = $('#btnAddColor')
    const acceptBtn = $('#acceptBtn')
    const cancelBtn = $('#cancelBtn')
    
    const changeGradHSL = hsl => {
      luminescent.style.background = `linear-gradient(to bottom, #fff, ${ hsl }, #000)`
    }
    
    const updateValues = () => {
      inputsRGB_HSL.forEach(input => input.removeEventListener('input', changeInverse))
      
      const { x, y, z } = this.#pixelXY
      const [ r, g, b ] = this.#pixel
      const { h, s, l } = this.#hsl
      
      inpR.value = r
      inpG.value = g
      inpB.value = b
      inpH.value = h
      inpS.value = s
      inpL.value = l
      
      pointerCol.style.left = `${ x - (width / 20 / 2) }px`
      pointerCol.style.top = `${ y - (width / 20 / 2) }px`
      pointerLum.style.top = `${ z - (width / 30) }px`
      
      inputsRGB_HSL.forEach(input => input.addEventListener('input', changeInverse))
      
      const value = this.HEX = RGBtoHEX(this.#pixel)
      container.style.setProperty('--value', value)
      
      this.dispatchEvent(
        new Event('change', { cancelable: true })
      )
    }
    
    const changeInverse = event => {
      const { target } = event
      const { value, name, id } = target
      
      target.value = +value
      
      if (value === '') target.value = 0
      
      if (name === 'HSL') {
        if (id === 'Sat' || id === 'Lum') {
          if (value > 100) target.value = 100
          else if (value < 0) target.value = 0
        } 
        else if (value > 360) target.value = 360
        else if (value < 0) target.value = 0
        
        const h = inpH.value || 0
        const s = inpS.value || 0
        const l = inpL.value || 0
        const a = 1
        
        const { x, y, z } = this.#pixelXY = HSLtoXYZ(h, s, l, width)
        
        pointerCol.style.left = `${ x - (width / 20 / 2) }px`
        pointerCol.style.top = `${ y - (width / 20 / 2) }px`
        pointerLum.style.top = `${ z - (width / 30) }px`
        
        this.#hsl = { h, s, l }
        
        changeGradHSL(`hsla(${ h }, ${ s }%, ${ l }%, ${ a })`)
        
        this.#pixel = HSLtoRGB(h, s, l)//pixels.slice(0, 3)
      } else if (name === 'RGB') {
        if (value > 255) target.value = 255
        else if (value < 0) target.value = 0
        
        const r = inpR.value || 0
        const g = inpG.value || 0
        const b = inpB.value || 0
        const a = 1
        
        this.#pixel = [ r, g, b ]
        
        const { h, s, l } = this.#hsl = RGBtoHSL(r, g, b)
        
        this.#pixelXY = HSLtoXYZ(h, s, l, width)
        
        changeGradHSL(`hsla(${ h }, ${ s }%, ${ l }%, ${ a })`)
      }
      
      updateValues()
    }
    
    const changeHueSat = (x, y) => {
      if (x <= 0) x = 0
      else if (x >= width) x = width - 1
      
      if (y <= 0) y = 0
      else if (y >= width) y = width - 1
      
      this.#pixelXY.x = x
      this.#pixelXY.y = y
      
      const { z } = this.#pixelXY
      const { h, s, l, a = 1 } = this.#hsl = XYZtoHSL(x, y, z, width)
      
      this.#pixel = HSLtoRGB(h, s, l)
      
      changeGradHSL(`hsla(${ h }, ${ s }%, 50%, ${ a })`)
      updateValues()
    }
    
    const changeLum = z => {
      if (z < 0) z = 0
      else if (z > width) z = width 
      
      this.#pixelXY.z = z
      
      const { x, y } = this.#pixelXY
      const { h, s, l, a = 1 } = this.#hsl = XYZtoHSL(x, y, z, width)
      
      this.#pixel = HSLtoRGB(h, s, l)
      
      updateValues()
    }
    
    const hueSatTouchEvent = event => {
      const { clientX, clientY } = event.targetTouches[0]
      const { x: canvasBonesX, y: canvasBonesY } = hueSat.getBoundingClientRect()
      const x = clientX - canvasBonesX
      const y = clientY - canvasBonesY
      
      changeHueSat(x, y)
    }
    
    const hueSatClickEvent = event => {
      const { offsetX, offsetY } = event
      
      changeHueSat(offsetX, offsetY)
    }
    
    const lumTouchEvent = event => {
      const { clientX, clientY } = event.targetTouches[0]
      const { y: lumBonesY } = luminescent.getBoundingClientRect()
      const z = clientY - lumBonesY
      
      changeLum(z)
    }
    
    const lumClickEvent = event => {
      const { offsetY } = event
      
      changeLum(offsetY)
    }
    
    const selectBasicColor = event => {
      const { target } = event
      
      const color = getComputedStyle(target).getPropertyValue('--color')
      const [ h, s, l, a = 1 ] = color.replace(/(hsl|\(|\)|\%)/g, '').split(',').map(value => +value)
      
      changeGradHSL(color)
      
      this.#hsl = { h, s, l }
      this.#pixelXY = HSLtoXYZ(h, s, l, width)
      this.#pixel = HSLtoRGB(h, s, l)
      
      updateValues()
    }
    
    const addCustomColor = () => {
      const { HSL } = this
      
      if (this.#customColors.length === 16) {
        this.#customColors = this.#customColors.reduce((arr, color, ind) => {
          const nextColor = this.#customColors[ind + 1]
          if (nextColor) arr[arr.length] = nextColor
          return arr
        }, [])
        this.#customColors[15] = HSL
      } else {
        this.#customColors.push(HSL)
      }
      
      customColors.forEach((color, ind) => color.style.setProperty('--color', this.#customColors[ind] || '#fff'))
    }
    
    hueSat.ontouchmove = hueSatTouchEvent
    hueSat.onclick = hueSatClickEvent
    luminescent.ontouchmove = lumTouchEvent
    luminescent.onclick = lumClickEvent
    btnAddColor.onclick = addCustomColor
    acceptBtn.onclick = () => this.dispatchEvent(new Event('accept'))
    cancelBtn.onclick = () => this.dispatchEvent(new Event('cancel'))
    
    basicColors.forEach(color => color.onclick = selectBasicColor)
    inputsRGB_HSL.forEach(input => input.oninput = changeInverse)
    
    updateValues()
  }
  
  static observedAttributes = [ 'width' ]
  static conversions = {
    XYZtoHSL: (x, y, z, width) => {
      const h = Math.round(360 / width * x)
      const s = Math.round(100 - ((100 * y) / width))
      const l = Math.round(100 - ((100 * z) / width))
      
      return { h, s, l }
    },
    
    HSLtoXYZ: (h, s, l, width) => {
      const x = Math.round(width * h / 360)
      const y = Math.round(width / 100 * (100 - s))
      const z = Math.round(width / 100 * (100 - l))
      
      return { x, y, z }
    },
    
    HSLtoRGB: (h, s, l) => {
      s /= 100;
      l /= 100;
    
      let c = (1 - Math.abs(2 * l - 1)) * s,
          x = c * (1 - Math.abs((h / 60) % 2 - 1)),
          m = l - c/2,
          r = 0,
          g = 0,
          b = 0;
          if (0 <= h && h < 60) {
        r = c; g = x; b = 0;  
      } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
      } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
      } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
      } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
      } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
      }
      r = Math.round((r + m) * 255)
      g = Math.round((g + m) * 255)
      b = Math.round((b + m) * 255)

      return [ r, g, b ]
    },
    
    RGBtoHSL: (r, g, b) => {
      r /= 255
      g /= 255
      b /= 255
      
      const l = Math.max(r, g, b)
      const s = l - Math.min(r, g, b)
      const h = s
        ? l === r
          ? (g - b) / s
          : l === g
          ? 2 + (b - r) / s
          : 4 + (r - g) / s
        : 0;
      
      return {
        h: Math.round(60 * h < 0 ? 60 * h + 360 : 60 * h),
        s: Math.round(100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0)),
        l: Math.round((100 * (2 * l - s)) / 2)
      }
    },
    
    RGBtoHEX: rgb => "#" + rgb.map(rgbColor => {
      const hexUn = Math.round(rgbColor).toString(16)
      return hexUn.length === 2 ? hexUn : `0${hexUn}`
    }).join('')
  }
  
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = this.styles + this.html
  }
})