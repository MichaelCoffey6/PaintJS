(() => {
  const { titleInp } = window
  
  titleInp.style.fieldSizing = "content"
  
  const { fieldSizing } = getComputedStyle(titleInp)
  
  if (fieldSizing !== 'content') {
    const titlePolyfill = () => {
      titleInp.style.width = 0
  
      const { scrollWidth, style } = titleInp
      style.width = (scrollWidth + 5) + "px"
    }
  
    titlePolyfill()
  
    titleInp.addEventListener('input', titlePolyfill)
  }
})()