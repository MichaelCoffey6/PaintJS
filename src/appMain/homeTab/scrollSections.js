import { State } from "../../state.js"
import { actionSections, scrollLeftBtn, scrollCont, scrollRightBtn } from "../../elements.js"
import { $ } from "../../const.js"

export const onScrollSections = ({ target }) => {
  const { currentExtSection, currentExtButton } = State
  const { scrollLeft, scrollWidth, clientWidth } = target

  if (scrollLeft > 0) {
    scrollLeftBtn.style.display = "block"
  } else {
    scrollLeftBtn.style.display = ""
  }

  if (Math.ceil(scrollLeft) + clientWidth >= scrollWidth) {
    scrollRightBtn.style.display = ""
  } else {
    scrollRightBtn.style.display = "block"
  }

  if (currentExtSection && currentExtSection) {
    const { x } = currentExtButton.getBoundingClientRect()
    const { width } = currentExtSection.getBoundingClientRect()

    if (x >= 5 && x + width <= extendSections.clientWidth - 5) {
      currentExtSection.style.left = `${x}px`
    } else if (x < 5) {
      currentExtSection.style.left = "5px"
    } else if (x + width > extendSections.clientWidth - 5) {
      currentExtSection.style.left = `${extendSections.clientWidth - 5 - width}px`
    }
  }
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(({ target, isIntersecting }) => {
    //observer.unobserve(entry.target);
    if (!isIntersecting) return 
    
    const { id } = $(`[data-section=${target.id}]`) ?? {}
    const currentExtButton = $(`[for=${id}]`)

    Object.assign(State, currentExtButton ? {
      currentExtButton,
      currentExtSection: target
    } : {
      currentExtButton: null,
      currentExtSection: null
    })
    
    onScrollSections({ target: scrollCont })
  })
}, {
  root: app,
  rootMargin: '0px',
  threshold: 0.5
})

actionSections.forEach(actionSection => observer.observe(actionSection))