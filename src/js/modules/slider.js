function css(el, style) {
  Object.assign(el.style, style)
}

export class Slider {
  static defaultOptions = () => ({
    active: 0,
    duration: 420,
  })

  static init(selector, options) {
    this.options = Object.assign(this.defaultOptions(), options)

    this.slider = document.querySelector(selector)
    this.items = this.slider.children
    this.width = this.items[0].clientWidth
    this.sliderWidth = this.slider.clientWidth
    this.viewCount = Math.round(this.sliderWidth / this.width)

    this.activeElement = this.options.active

    css(this.slider, {
      transition: ` all ease-out ${this.options.duration}ms`,
    })

    this.changeSlide()
    document.addEventListener('click', this.click.bind(this))

    if (!!window.navigator.maxTouchPoints) {
      this.slider.addEventListener('touchstart', this.touchstart.bind(this))
      this.slider.addEventListener('touchmove', this.touchmove.bind(this))
      this.slider.addEventListener('touchend', this.touchend.bind(this))
    }
  }

  static click(e) {
    const data = e.target.dataset
    if (data.el && data.target === this.slider.id) {
      if (data.el === 'arrow-left') this.previous()
      else if (data.el === 'arrow-right') this.next()
    }
    // else if (data.indicator) {
    //   this.activeElement = +data.indicator
    //   this.changeSlide()
    // }
  }

  static touchstart(e) {
    this.x = e.touches[0].clientX
    this.y = e.touches[0].clientY
  }

  static touchmove(e) {
    this.xEnd = e.touches[0].clientX
    this.yEnd = e.touches[0].clientY
  }

  static touchend() {
    if (Math.abs(this.xEnd - this.x) > Math.abs(this.yEnd - this.y)) {
      if (this.xEnd - this.x > 0) this.previous()
      else this.next()
    }
    delete this.x
    delete this.y
    delete this.xEnd
    delete this.yEnd
  }

  static next() {
    this.activeElement++
    if (this.activeElement > this.items.length - this.viewCount)
      this.activeElement = 0
    this.changeSlide()
  }

  static previous() {
    this.activeElement--
    if (this.activeElement === -1)
      this.activeElement = this.items.length - this.viewCount
    this.changeSlide()
  }

  static changeSlide() {
    const translate =
      this.width * (this.items.length - this.activeElement) < this.sliderWidth
        ? -this.width * this.items.length + this.sliderWidth
        : -this.width * this.activeElement

    css(this.slider, {
      transform: `translateX(${translate}px)`,
    })

    // if (this.options.indicators)
    //   this.indicators.map((item, i) => {
    //     item.classList.remove('active')
    //     if (i === this.activeElement) item.classList.add('active')
    //   })
  }
}
