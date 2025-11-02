(() => {
  // src/fixFont.js
  (() => {
    const { fontSize } = getComputedStyle(window.app);
    if (fontSize !== "14px") {
      const sheet = new CSSStyleSheet();
      sheet.addRule("body *", "font-size: 12.5px !important");
      document.adoptedStyleSheets.push(sheet);
    }
  })();

  // src/appHeader/titlePolyfill.js
  (() => {
    const { titleInp: titleInp2 } = window;
    titleInp2.style.fieldSizing = "content";
    const { fieldSizing } = getComputedStyle(titleInp2);
    if (fieldSizing !== "content") {
      const titlePolyfill = () => {
        titleInp2.style.width = 0;
        const { scrollWidth, style } = titleInp2;
        style.width = scrollWidth + 5 + "px";
      };
      titlePolyfill();
      titleInp2.addEventListener("input", titlePolyfill);
    }
  })();

  // src/appMain/homeTab/ColorPicker.js
  customElements.define("color-picker", class ColorPicker extends HTMLElement {
    #connected = false;
    #inChangeWidthProp = false;
    #width = 360;
    #hex = "#ff0000";
    #hsl = { h: 0, s: 100, l: 50 };
    #pixel = [255, 0, 0];
    #pixelXY = { x: 0, y: 0, z: 0 };
    #events = /* @__PURE__ */ new Map();
    #customColors = [];
    get RGB() {
      const [r, g, b, a = 1] = this.#pixel;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    get RGBv() {
      const [r, g, b] = this.#pixel;
      return { r, g, b };
    }
    get HSL() {
      const { h, s, l, a = 1 } = this.#hsl;
      return `hsla(${h}, ${s}%, ${l}%, ${a})`;
    }
    get HSLv() {
      return this.#hsl;
    }
    set HEX(newValue) {
      this.#hex = newValue;
    }
    get HEX() {
      return this.#hex;
    }
    set width(newValue) {
      this.#inChangeWidthProp = true;
      this.setAttribute("width", String(newValue));
      this.#inChangeWidthProp = false;
      this.#width = +newValue;
      this.script(newValue);
    }
    get width() {
      return this.#width;
    }
    callback(fn, type) {
      fn.call(this, {
        target: this,
        rgb: this.RGB,
        hsl: this.HSL,
        hex: this.HEX,
        hslValues: this.HSLv,
        rgbValues: this.RGBv,
        type
      });
    }
    on(type, fn) {
      const callback = () => this.callback(fn, type);
      this.#events.set(fn, callback);
      this.addEventListener(type, this.#events.get(fn));
    }
    off(type, fn) {
      this.removeEventListener(type, this.#events.get(fn));
      this.#events.delete(fn);
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "width" && !this.#inChangeWidthProp) {
        this.#width = newValue;
        this.script(newValue);
      }
    }
    connectedCallback() {
      this.#width = +this.getAttribute("width") || this.#width;
      this.script(this.#width);
    }
    get styles() {
      const { width, value } = this;
      return `<style>
  @scope {
    :host {
      display: inline-block
    }
    
    *, button, input {
      font-family: inherit, Arial, system-ui;
    }
    
    #colorPicker {
      --totalWidth: ${width}px;
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
</style>`;
    }
    get html() {
      const basicColorsArr = ["hsl(0,100%,75%)", "hsl(60,100%,75%)", "hsl(120,100%,75%)", "hsl(150,100%,50%)", "hsl(180,100%,75%)", "hsl(210,100%,50%)", "hsl(330,100%,75%)", "hsl(300,100%,75%)", "hsl(0,100%,50%)", "hsl(60,100%,50%)", "hsl(90,100%,50%)", "hsl(135,100%,50%)", "hsl(180,100%,50%)", "hsl(200,60%,38%)", "hsl(240,34%,63%)", "hsl(300,100%,50%)", "hsl(0,20%,38%)", "hsl(20,100%,63%)", "hsl(120,100%,50%)", "hsl(180,34%,25%)", "hsl(210,34%,25%)", "hsl(240,100%,75%)", "hsl(330,34%,25%)", "hsl(330,100%,50%)", "hsl(0,34%,25%)", "hsl(30,100%,50%)", "hsl(120,34%,25%)", "hsl(150,34%,25%)", "hsl(240,100%,50%)", "hsl(240,46%,31%)", "hsl(300,34%,25%)", "hsl(270,100%,50%)", "hsl(0,100%,13%)", "hsl(30,34%,25%)", "hsl(120,100%,13%)", "hsl(180,100%,13%)", "hsl(240,34%,25%)", "hsl(240,100%,13%)", "hsl(300,100%,13%)", "hsl(270,34%,25%)", "hsl(0,0%,0%)", "hsl(60,34%,25%)", "hsl(60,20%,38%)", "hsl(0,0%,50%)", "hsl(180,20%,38%)", "hsl(0,0%,75%)", "hsl(300,100%,13%)", "hsl(0,0%,100%)"];
      let basicColors = "";
      let customColors = "";
      for (let ind = 0; ind < 8 * 6; ind++) {
        basicColors += `<span class="basicColors" style="--color: ${basicColorsArr[ind]}"></span>`;
        if (ind < 8 * 2) customColors += `<span class="customColors" style="--color: ${this.#customColors[ind] || "#fff"}"></span>`;
      }
      return `
  <div id="colorPicker">
    <section id="pallette">
      <article id="basicColors">
        <p>Basic colors:</p>
        <div>${basicColors}</div>
      </article>
      <article id="customColors">
        <p>Custom colors:</p>
        <div>${customColors}</div>
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
  </div>`;
    }
    script(changeWidth) {
      const { shadowRoot } = this;
      const { HSLtoXYZ, HSLtoRGB, XYZtoHSL, RGBtoHEX, RGBtoHSL } = ColorPicker.conversions;
      const $2 = (sel) => shadowRoot.querySelector(sel);
      const $$2 = (sel) => shadowRoot.querySelectorAll(sel);
      const cl2 = (...log) => console.log(...log);
      const container = $2("#colorPicker");
      const hueSat = $2("#colorPickerCanvas");
      container.style.setProperty("--totalWidth", `${changeWidth}px`);
      const width = parseFloat(getComputedStyle(hueSat).getPropertyValue("width"));
      const { h, s, l } = this.#hsl;
      this.#pixelXY = HSLtoXYZ(h, s, l, width);
      const basicColors = $$2(".basicColors");
      const customColors = $$2(".customColors");
      const currentColor = $2("#currentColor");
      const inputsRGB_HSL = $$2("#inputs input");
      const inpR = $2("#Red");
      const inpG = $2("#Green");
      const inpB = $2("#Blue");
      const inpH = $2("#Hue");
      const inpS = $2("#Sat");
      const inpL = $2("#Lum");
      const pointerLum = $2("#pointerLum");
      const pointerCol = $2("#pointerCol");
      const luminescent = $2("#luminescent");
      const btnAddColor = $2("#btnAddColor");
      const acceptBtn = $2("#acceptBtn");
      const cancelBtn = $2("#cancelBtn");
      const changeGradHSL = (hsl) => {
        luminescent.style.background = `linear-gradient(to bottom, #fff, ${hsl}, #000)`;
      };
      const updateValues = () => {
        inputsRGB_HSL.forEach((input) => input.removeEventListener("input", changeInverse));
        const { x, y, z } = this.#pixelXY;
        const [r, g, b] = this.#pixel;
        const { h: h2, s: s2, l: l2 } = this.#hsl;
        inpR.value = r;
        inpG.value = g;
        inpB.value = b;
        inpH.value = h2;
        inpS.value = s2;
        inpL.value = l2;
        pointerCol.style.left = `${x - width / 20 / 2}px`;
        pointerCol.style.top = `${y - width / 20 / 2}px`;
        pointerLum.style.top = `${z - width / 30}px`;
        inputsRGB_HSL.forEach((input) => input.addEventListener("input", changeInverse));
        const value = this.HEX = RGBtoHEX(this.#pixel);
        container.style.setProperty("--value", value);
        this.dispatchEvent(
          new Event("change", { cancelable: true })
        );
      };
      const changeInverse = (event) => {
        const { target } = event;
        const { value, name, id } = target;
        target.value = +value;
        if (value === "") target.value = 0;
        if (name === "HSL") {
          if (id === "Sat" || id === "Lum") {
            if (value > 100) target.value = 100;
            else if (value < 0) target.value = 0;
          } else if (value > 360) target.value = 360;
          else if (value < 0) target.value = 0;
          const h2 = inpH.value || 0;
          const s2 = inpS.value || 0;
          const l2 = inpL.value || 0;
          const a = 1;
          const { x, y, z } = this.#pixelXY = HSLtoXYZ(h2, s2, l2, width);
          pointerCol.style.left = `${x - width / 20 / 2}px`;
          pointerCol.style.top = `${y - width / 20 / 2}px`;
          pointerLum.style.top = `${z - width / 30}px`;
          this.#hsl = { h: h2, s: s2, l: l2 };
          changeGradHSL(`hsla(${h2}, ${s2}%, ${l2}%, ${a})`);
          this.#pixel = HSLtoRGB(h2, s2, l2);
        } else if (name === "RGB") {
          if (value > 255) target.value = 255;
          else if (value < 0) target.value = 0;
          const r = inpR.value || 0;
          const g = inpG.value || 0;
          const b = inpB.value || 0;
          const a = 1;
          this.#pixel = [r, g, b];
          const { h: h2, s: s2, l: l2 } = this.#hsl = RGBtoHSL(r, g, b);
          this.#pixelXY = HSLtoXYZ(h2, s2, l2, width);
          changeGradHSL(`hsla(${h2}, ${s2}%, ${l2}%, ${a})`);
        }
        updateValues();
      };
      const changeHueSat = (x, y) => {
        if (x <= 0) x = 0;
        else if (x >= width) x = width - 1;
        if (y <= 0) y = 0;
        else if (y >= width) y = width - 1;
        this.#pixelXY.x = x;
        this.#pixelXY.y = y;
        const { z } = this.#pixelXY;
        const { h: h2, s: s2, l: l2, a = 1 } = this.#hsl = XYZtoHSL(x, y, z, width);
        this.#pixel = HSLtoRGB(h2, s2, l2);
        changeGradHSL(`hsla(${h2}, ${s2}%, 50%, ${a})`);
        updateValues();
      };
      const changeLum = (z) => {
        if (z < 0) z = 0;
        else if (z > width) z = width;
        this.#pixelXY.z = z;
        const { x, y } = this.#pixelXY;
        const { h: h2, s: s2, l: l2, a = 1 } = this.#hsl = XYZtoHSL(x, y, z, width);
        this.#pixel = HSLtoRGB(h2, s2, l2);
        updateValues();
      };
      const hueSatTouchEvent = (event) => {
        const { clientX, clientY } = event.targetTouches[0];
        const { x: canvasBonesX, y: canvasBonesY } = hueSat.getBoundingClientRect();
        const x = clientX - canvasBonesX;
        const y = clientY - canvasBonesY;
        changeHueSat(x, y);
      };
      const hueSatClickEvent = (event) => {
        const { offsetX, offsetY } = event;
        changeHueSat(offsetX, offsetY);
      };
      const lumTouchEvent = (event) => {
        const { clientX, clientY } = event.targetTouches[0];
        const { y: lumBonesY } = luminescent.getBoundingClientRect();
        const z = clientY - lumBonesY;
        changeLum(z);
      };
      const lumClickEvent = (event) => {
        const { offsetY } = event;
        changeLum(offsetY);
      };
      const selectBasicColor = (event) => {
        const { target } = event;
        const color = getComputedStyle(target).getPropertyValue("--color");
        const [h2, s2, l2, a = 1] = color.replace(/(hsl|\(|\)|\%)/g, "").split(",").map((value) => +value);
        changeGradHSL(color);
        this.#hsl = { h: h2, s: s2, l: l2 };
        this.#pixelXY = HSLtoXYZ(h2, s2, l2, width);
        this.#pixel = HSLtoRGB(h2, s2, l2);
        updateValues();
      };
      const addCustomColor = () => {
        const { HSL } = this;
        if (this.#customColors.length === 16) {
          this.#customColors = this.#customColors.reduce((arr, color, ind) => {
            const nextColor = this.#customColors[ind + 1];
            if (nextColor) arr[arr.length] = nextColor;
            return arr;
          }, []);
          this.#customColors[15] = HSL;
        } else {
          this.#customColors.push(HSL);
        }
        customColors.forEach((color, ind) => color.style.setProperty("--color", this.#customColors[ind] || "#fff"));
      };
      hueSat.ontouchmove = hueSatTouchEvent;
      hueSat.onclick = hueSatClickEvent;
      luminescent.ontouchmove = lumTouchEvent;
      luminescent.onclick = lumClickEvent;
      btnAddColor.onclick = addCustomColor;
      acceptBtn.onclick = () => this.dispatchEvent(new Event("accept"));
      cancelBtn.onclick = () => this.dispatchEvent(new Event("cancel"));
      basicColors.forEach((color) => color.onclick = selectBasicColor);
      inputsRGB_HSL.forEach((input) => input.oninput = changeInverse);
      updateValues();
    }
    static observedAttributes = ["width"];
    static conversions = {
      XYZtoHSL: (x, y, z, width) => {
        const h = Math.round(360 / width * x);
        const s = Math.round(100 - 100 * y / width);
        const l = Math.round(100 - 100 * z / width);
        return { h, s, l };
      },
      HSLtoXYZ: (h, s, l, width) => {
        const x = Math.round(width * h / 360);
        const y = Math.round(width / 100 * (100 - s));
        const z = Math.round(width / 100 * (100 - l));
        return { x, y, z };
      },
      HSLtoRGB: (h, s, l) => {
        s /= 100;
        l /= 100;
        let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(h / 60 % 2 - 1)), m = l - c / 2, r = 0, g = 0, b = 0;
        if (0 <= h && h < 60) {
          r = c;
          g = x;
          b = 0;
        } else if (60 <= h && h < 120) {
          r = x;
          g = c;
          b = 0;
        } else if (120 <= h && h < 180) {
          r = 0;
          g = c;
          b = x;
        } else if (180 <= h && h < 240) {
          r = 0;
          g = x;
          b = c;
        } else if (240 <= h && h < 300) {
          r = x;
          g = 0;
          b = c;
        } else if (300 <= h && h < 360) {
          r = c;
          g = 0;
          b = x;
        }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        return [r, g, b];
      },
      RGBtoHSL: (r, g, b) => {
        r /= 255;
        g /= 255;
        b /= 255;
        const l = Math.max(r, g, b);
        const s = l - Math.min(r, g, b);
        const h = s ? l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s : 0;
        return {
          h: Math.round(60 * h < 0 ? 60 * h + 360 : 60 * h),
          s: Math.round(100 * (s ? l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s)) : 0)),
          l: Math.round(100 * (2 * l - s) / 2)
        };
      },
      RGBtoHEX: (rgb) => "#" + rgb.map((rgbColor) => {
        const hexUn = Math.round(rgbColor).toString(16);
        return hexUn.length === 2 ? hexUn : `0${hexUn}`;
      }).join("")
    };
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = this.styles + this.html;
    }
  });

  // src/const.js
  var $ = (sel, ctx2 = document) => ctx2.querySelector(sel);
  var $$ = (sel, ctx2 = document) => ctx2.querySelectorAll(sel);
  var MODES = {
    draw: "draw"
  };
  var ZOOM = /* @__PURE__ */ new Map([
    [14, 12.5],
    [28, 25],
    [42, 50],
    [56, 75],
    [70, 100],
    [80, 200],
    [90, 300],
    [100, 400],
    [110, 500],
    [120, 600],
    [130, 700],
    [140, 800]
  ]);
  var arrZOOM = Array.from(ZOOM);

  // src/elements.js
  var {
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
  } = window;
  var ctx = canvas.getContext("2d");
  var actionSections = $$("#homeSections > section, #homeSections > div[role=dialog]");
  var tabsInp = $$("[name=actionSectionInp]");
  var clipboardBigBtn = $("#clipboardSection .bigBtn");
  var imageBigBtn = $("#imageSection .bigBtn");
  var clipboardExtOpts = $("#clipboardSection .extendOpts");
  var imageExtOpts = $("#imageSection .bigBtn .extendOpts");
  var clipboardExtAct = $("#clipboardSection .extendAction");
  var imageExtAct = $("#imageSection .bigBtn .extendAction");

  // src/appMain/workspace/rulers.js
  var rulerScale = 100;
  workspace.style.setProperty("--ruler-scale", `${rulerScale}px`);
  var getRulerSections = (rulerSectionsLen) => {
    const rulerSections = [];
    for (let i = 0; i < rulerSectionsLen; i++) {
      const rulerSeparator = document.createElement("span");
      const rulerSection = rulerSectionTmpl.content.cloneNode(true);
      const rulerNumber = $(".rulerNumber", rulerSection);
      rulerNumber.innerText = i * rulerScale;
      rulerSeparator.classList.add("rulerSeparator");
      rulerSections.push(rulerSeparator, rulerSection);
    }
    return rulerSections;
  };
  var setRulerSections = () => {
    const rulerSectionsX = getRulerSections(workspace.clientWidth / rulerScale);
    const rulerSectionsY = getRulerSections(workspace.clientHeight / rulerScale);
    rulerX.replaceChildren.apply(rulerX, rulerSectionsX);
    rulerY.replaceChildren.apply(rulerY, rulerSectionsY);
  };
  setRulerSections();

  // src/state.js
  var State = {
    fileName: "",
    currentPictureId: "",
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
  };
  var nimg1 = new ImageData(1, 1);
  Object.assign(nimg1.data, [
    255,
    0,
    0,
    255
  ]);
  var nimg2 = new ImageData(1, 1);
  Object.assign(nimg2.data, [
    0,
    255,
    0,
    255
  ]);
  State.recentPicturesArr = [
    {
      imgData: nimg1,
      fileName: "Test1.png",
      recentPictureId: crypto.randomUUID()
    },
    {
      imgData: nimg2,
      fileName: "Test2.png",
      recentPictureId: crypto.randomUUID()
    }
  ];

  // src/appHeader/undoAndRedo.js
  var undoDraw = () => {
    if (State.historyIndex === 0) return;
    const historyIndex = --State.historyIndex;
    const data = State.history[historyIndex];
    const { width, height } = data;
    canvas.width = State.canvasWidth = width;
    canvas.height = State.canvasHeight = height;
    redoBtn.disabled = false;
    ctx.putImageData(State.cleanImgData = data, 0, 0);
    if (historyIndex === 0) undoBtn.disabled = true;
  };
  var redoDraw = () => {
    if (State.historyIndex === State.history.length - 1) return;
    const historyIndex = ++State.historyIndex;
    const data = State.history[historyIndex];
    const { width, height } = data;
    canvas.width = State.canvasWidth = width;
    canvas.height = State.canvasHeight = height;
    undoBtn.disabled = false;
    ctx.putImageData(State.cleanImgData = data, 0, 0);
    if (historyIndex === State.history.length - 1) redoBtn.disabled = true;
  };

  // src/history.js
  var newHistoryChange = () => {
    const { canvasWidth, canvasHeight } = State;
    const historyIndex = ++State.historyIndex;
    undoBtn.disabled = historyIndex === 0 ? true : false;
    redoBtn.disabled = true;
    State.cleanImgData = State.history[historyIndex] = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    State.history = State.history.slice(0, historyIndex + 1);
    cl(State.history);
  };

  // src/appFooter/zoomBar.js
  var changeZoom = () => {
    const zoom = zoomBar.value;
    const indexZoom = zoom >= 0 && zoom <= 21 ? 14 : zoom >= 22 && zoom <= 35 ? 28 : zoom >= 36 && zoom <= 49 ? 42 : zoom >= 50 && zoom <= 63 ? 56 : zoom >= 64 && zoom <= 75 ? 70 : zoom >= 76 && zoom <= 85 ? 80 : zoom >= 86 && zoom <= 95 ? 90 : zoom >= 96 && zoom <= 105 ? 100 : zoom >= 106 && zoom <= 115 ? 110 : zoom >= 116 && zoom <= 125 ? 120 : zoom >= 126 && zoom <= 135 ? 130 : 140;
    zoomBar.value = indexZoom;
    const zoomScale = ZOOM.get(indexZoom);
    zoomValue.innerText = zoomScale + "%";
    canvas.style.width = Math.round(State.canvasWidth / 100 * zoomScale) + "px";
    $$("#rulerX .rulerNumber").forEach((rulerNumber, i) => {
      rulerNumber.innerText = Math.round(100 / zoomScale * (100 * i));
    });
    $$("#rulerY .rulerNumber").forEach((rulerNumber, i) => {
      rulerNumber.innerText = Math.round(100 / zoomScale * (100 * i));
    });
  };

  // src/appMain/fileTab/recentPictures.js
  var openRecentPicture = ({ target }) => {
    if (target.parentElement !== recentPicturesList) return;
    fileTabChk.checked = false;
    const { recentPictureId } = target.dataset;
    const recentPictureIndex = State.recentPicturesArr.findIndex((item) => {
      const { recentPictureId: id } = item;
      return recentPictureId === id;
    });
    const { imgData, fileName } = State.recentPicturesArr[recentPictureIndex];
    const { width, height } = imgData;
    State.recentPicturesArr.splice(recentPictureIndex, 1);
    State.recentPicturesArr.unshift({ imgData, fileName, recentPictureId });
    State.canvasWidth = canvas.width = width;
    State.canvasHeight = canvas.height = height;
    State.currentPictureId = recentPictureId;
    State.cleanImgData = imgData;
    State.fileName = titleInp.value = fileName;
    State.historyIndex = -1;
    State.history = [];
    recentPicturesList.replaceChildren.apply(
      recentPicturesList,
      State.recentPicturesArr.map(({ imgData: imgData2, fileName: fileName2, recentPictureId: recentPictureId2 }) => {
        const li = document.createElement("li");
        li.innerText = fileName2;
        li.dataset.recentPictureId = recentPictureId2;
        return li;
      })
    );
    ctx.putImageData(imgData, 0, 0);
    changeZoom();
    newHistoryChange();
  };
  window.deleteDB = () => indexedDB.deleteDatabase("MichaelCoffey-PaintJS-DB");

  // src/appMain/homeTab/scrollSections.js
  var onScrollSections = ({ target }) => {
    const { currentExtSection, currentExtButton } = State;
    const { scrollLeft, scrollWidth, clientWidth } = target;
    if (scrollLeft > 0) {
      scrollLeftBtn.style.display = "block";
    } else {
      scrollLeftBtn.style.display = "";
    }
    if (Math.ceil(scrollLeft) + clientWidth >= scrollWidth) {
      scrollRightBtn.style.display = "";
    } else {
      scrollRightBtn.style.display = "block";
    }
    if (currentExtSection && currentExtSection) {
      const { x } = currentExtButton.getBoundingClientRect();
      const { width } = currentExtSection.getBoundingClientRect();
      if (x >= 5 && x + width <= extendSections.clientWidth - 5) {
        currentExtSection.style.left = `${x}px`;
      } else if (x < 5) {
        currentExtSection.style.left = "5px";
      } else if (x + width > extendSections.clientWidth - 5) {
        currentExtSection.style.left = `${extendSections.clientWidth - 5 - width}px`;
      }
    }
  };
  var observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      const { id } = $(`[data-section=${target.id}]`) ?? {};
      const currentExtButton = $(`[for=${id}]`);
      Object.assign(State, currentExtButton ? {
        currentExtButton,
        currentExtSection: target
      } : {
        currentExtButton: null,
        currentExtSection: null
      });
      onScrollSections({ target: scrollCont });
    });
  }, {
    root: app,
    rootMargin: "0px",
    threshold: 0.5
  });
  actionSections.forEach((actionSection) => observer.observe(actionSection));

  // src/appMain/homeTab/colors.js
  var cancelColorPicker = () => {
    colorPickerCont.style.display = "";
  };

  // src/appMain/viewTab/zoom.js
  var zoomIn = () => {
    const currentZoom = +zoomBar.value;
    const nextIndex = arrZOOM.findIndex(([key]) => key === currentZoom) + 1;
    if (nextIndex >= arrZOOM.length) return;
    zoomBar.value = arrZOOM[nextIndex][0];
    changeZoom();
  };
  var zoomOut = () => {
    const currentZoom = +zoomBar.value;
    const nextIndex = arrZOOM.findIndex(([key]) => key === currentZoom) - 1;
    if (nextIndex < 0) return;
    zoomBar.value = arrZOOM[nextIndex][0];
    changeZoom();
  };
  var zoom100 = () => {
    zoomBar.value = 70;
    changeZoom();
  };

  // src/utils.js
  var getOffset = (event) => {
    const { x, y, width, height } = canvas.getBoundingClientRect();
    const { canvasWidth, canvasHeight } = State;
    const { clientX, clientY } = event instanceof TouchEvent ? event.changedTouches[0] : event;
    const offsetX = Math.round(canvasWidth / width * (clientX - x));
    const offsetY = Math.round(canvasHeight / height * (clientY - y));
    return { offsetX, offsetY };
  };
  var desfase = (offsetX, offsetY, lastX2, lastY2) => {
    const b = offsetX - lastX2;
    const h = offsetY - lastY2;
    const hip = Math.hypot(b, h);
    const x = h / hip * 0.5;
    const y = b / hip * 0.5;
    return { x, y };
  };

  // src/pointerEvents.js
  var lastX = 0;
  var lastY = 0;
  var startX = 0;
  var startY = 0;
  var onPointerDown = (event) => {
    const { pointerType } = event;
    const { offsetX, offsetY } = getOffset(event);
    State.pointerType = pointerType === "touch" ? TouchEvent : MouseEvent;
    State.pointerDown = true;
    lastX = startX = offsetX;
    lastY = startY = offsetY;
  };
  var onPointerMove = (event) => {
    const { constructor } = event;
    const { pointerType, pointerDown, widthIsPair } = State;
    if (constructor !== pointerType) return;
    if (!pointerDown) return;
    State.pointerMove = true;
    const { offsetX, offsetY } = getOffset(event);
    const { x = 0, y = 0 } = widthIsPair ? desfase(offsetX, offsetY, lastX, lastY) : {};
    ctx.beginPath();
    ctx.moveTo(lastX - x, lastY - y);
    ctx.lineTo(offsetX - x, offsetY - y);
    ctx.stroke();
    lastX = offsetX;
    lastY = offsetY;
  };
  var onPointerUp = (event) => {
    const { constructor } = event;
    const { pointerType, pointerDown, pointerMove, widthIsPair } = State;
    if (constructor !== pointerType) return;
    if (!pointerDown) return;
    if (!pointerMove) {
      const { offsetX, offsetY } = getOffset(event);
      ctx.fillRect(offsetX, offsetY, 1, 1);
    }
    newHistoryChange();
    State.pointerDown = false;
    State.pointerMove = false;
  };

  // src/listeners.js
  window.addEventListener("load", () => onScrollSections({ target: scrollCont }));
  colorPicker.addEventListener("cancel", cancelColorPicker);
  undoBtn.addEventListener("click", undoDraw);
  redoBtn.addEventListener("click", redoDraw);
  recentPicturesList.addEventListener("click", openRecentPicture);
  tabsInp.forEach((inp) => inp.addEventListener("change", () => onScrollSections({ target: scrollCont })));
  scrollRightBtn.addEventListener("click", () => scrollCont.scroll(scrollCont.scrollWidth, 0));
  scrollLeftBtn.addEventListener("click", () => scrollCont.scroll(0, 0));
  scrollCont.addEventListener("scroll", onScrollSections);
  zoomInBtn.addEventListener("click", zoomIn);
  zoomOutBtn.addEventListener("click", zoomOut);
  zoom100Btn.addEventListener("click", zoom100);
  zoomInBarBtn.addEventListener("click", zoomIn);
  zoomBar.addEventListener("input", changeZoom);
  zoomOutBarBtn.addEventListener("click", zoomOut);
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("touchmove", onPointerMove);
  canvas.addEventListener("mousemove", onPointerMove);
  canvas.addEventListener("touchend", onPointerUp);
  canvas.addEventListener("mouseup", onPointerUp);

  // app.mjs
  State.canvasWidth = canvas.width = 40;
  State.canvasHeight = canvas.height = 40;
  newHistoryChange();
  recentPicturesList.replaceChildren.apply(
    recentPicturesList,
    State.recentPicturesArr.map(({ imgData, fileName, recentPictureId }) => {
      const li = document.createElement("li");
      li.innerText = fileName;
      li.dataset.recentPictureId = recentPictureId;
      return li;
    })
  );
})();
