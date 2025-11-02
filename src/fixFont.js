(() => {
  const { fontSize } = getComputedStyle(window.app)
  
  if (fontSize !== '14px') {
    const sheet = new CSSStyleSheet()
    sheet.addRule('body *', 'font-size: 12.5px !important')
    document.adoptedStyleSheets.push(sheet)
  }
})()