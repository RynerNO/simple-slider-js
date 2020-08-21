import './styles.sass'
class Slider {
	constructor(slider, options = {}) {
		this.autoplay = options.autoplay === false ? false : true
		this.autoplayDelay = options.autoplayDelay || 5000
		this.infinite = options.infinite === false ? false : true
		this.slider =
			typeof slider === 'string' ? document.querySelector(slider) : slider
		this.currentSlide = 0
	}
	_slideToLeft() {
		window.requestAnimationFrame(() => {
			if (
				this.currentSlide === this.slides.length - 1 ||
				this.currentSlide === 0
			) {
				return
			}
			this.currentSlide += 1
			this.slidesContainer.style.transition = 'left 0.3s linear'
			this.slidesContainer.style.left = `-${
				this.slidesContainer.clientWidth * this.currentSlide
			}px`
		})
	}
	_slideToRight() {
		window.requestAnimationFrame(() => {
			if (
				this.currentSlide === this.slides.length - 1 ||
				this.currentSlide === 0
			) {
				return
			}
			this.currentSlide -= 1
			this.slidesContainer.style.transition = 'left 0.3s linear'
			this.slidesContainer.style.left = `-${
				this.slidesContainer.clientWidth * this.currentSlide
			}px`
		})
	}
	_setAutoplay() {
		setInterval(() => {
			this._slideToLeft()
		}, this.autoplayDelay)
	}
	_setInfinite() {
		// Clone nodes from start and end of the slider and insert
		let beforeClone = this.slides[this.slides.length - 1].cloneNode(true)
		let afterClone = this.slides[0].cloneNode(true)
		this.slidesContainer.insertBefore(beforeClone, this.slides[0])
		this.slidesContainer.appendChild(afterClone)

		// shift current slide to one because of the node insert
		this.currentSlide = 1
		this.slidesContainer.style.left = `-${
			this.slidesContainer.clientWidth * this.currentSlide
		}px`

		// for smoth switch to start or end of the slider set it on transitionend event
		this.slidesContainer.addEventListener('transitionend', () => {
			this.slidesContainer.style.transition = 'none'

			if (this.currentSlide === this.slides.length - 1) {
				this.slidesContainer.style.left = `-${this.slidesContainer.clientWidth}px`
				this.currentSlide = 1
			}
			if (this.currentSlide === 0) {
				this.slidesContainer.style.left = `-${
					this.slidesContainer.clientWidth * (this.slides.length - 2)
				}px `
				this.currentSlide = this.slides.length - 2
			}
		})
	}
	_drag(start, end) {
		window.requestAnimationFrame(() => {
			this.slidesContainer.style.left = `-${
				this.slidesContainer.clientWidth * this.currentSlide + (start - end)
			}px`
		})
	}
	_dragEnd(start, end) {
		if (end - start > 150) {
			this._slideToRight()
		} else if (end - start < -150) {
			this._slideToLeft()
		} else {
			this.slidesContainer.style.left = `-${
				this.slidesContainer.clientWidth * this.currentSlide
			}px`
		}
	}
	_setDragging() {
		this.slidesContainer.setAttribute('draggable', 'true')
		let startX
		let endX
		this.slidesContainer.addEventListener('drag', (e) => {
			if (e.clientX === 0) return
			endX = e.clientX
			if (!startX) startX = endX

			this._drag(startX, endX)
		})
		this.slidesContainer.addEventListener('dragend', (e) => {
			if (!startX) return
			this._dragEnd(startX, endX)
			startX = undefined
			endX = undefined
		})
		this.slidesContainer.addEventListener('touchmove', (e) => {
			if (e.targetTouches[0].clientX === 0) return
			endX = e.targetTouches[0].clientX
			if (!startX) startX = endX
			this._drag(startX, endX)
		})
		this.slidesContainer.addEventListener('touchend', (e) => {
			if (!startX) return
			this._dragEnd(startX, endX)
			startX = undefined
			endX = undefined
		})
	}
	init() {
		this.slidesContainer = this.slider.querySelector('.slider__slides')
		this.slides = this.slidesContainer.children

		if (this.infinite) {
			this._setInfinite()
		}
		this.arrowLeft = this.slider
			.querySelector('.slider__controls')
			.querySelector('.slider__arrow-left')
		this.arrowRigth = this.slider
			.querySelector('.slider__controls')
			.querySelector('.slider__arrow-right')

		this.arrowLeft.addEventListener('click', (e) => {
			e.preventDefault()
			this._slideToLeft()
		})
		this.arrowRigth.addEventListener('click', (e) => {
			e.preventDefault()
			this._slideToRight()
		})

		window.addEventListener('resize', () => {
			window.requestAnimationFrame(() => {
				for (let slide of this.slides) {
					slide.style.width = `${this.slidesContainer.clientWidth}px`
				}
				this.slidesContainer.style.left = `-${
					this.slidesContainer.clientWidth * this.currentSlide
				}px`
			})
		})
		if (this.autoplay) {
			this._setAutoplay()
		}
		this._setDragging()
	}
}
