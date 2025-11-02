export const $ = (sel, ctx = document) => ctx.querySelector(sel)
export const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel)
export const cl = (...log) => console.log(...log)

export const MODES = {
  draw: 'draw'
}

export const ZOOM = new Map([
  [ 14, 12.5 ], 
  [ 28, 25 ], 
  [ 42, 50 ], 
  [ 56, 75 ], 
  [ 70, 100 ], 
  [ 80, 200 ], 
  [ 90, 300 ], 
  [ 100, 400 ], 
  [ 110, 500 ], 
  [ 120, 600 ], 
  [ 130, 700 ], 
  [ 140, 800 ]
])

export const arrZOOM = Array.from(ZOOM)