export class Sidenav {
  static init(burger, menu) {
    this.burger = document.querySelector(burger)
    this.menu = document.querySelector(menu)

    this.burger.addEventListener('click', this.open.bind(this))
    this.menu.addEventListener('click', this.click.bind(this))
    if (!!window.navigator.maxTouchPoints) {
      this.menu.addEventListener('touchstart', this.touchstart.bind(this))
      this.menu.addEventListener('touchmove', this.touchmove.bind(this))
      this.menu.addEventListener('touchend', this.touchend.bind(this))
    }
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
      if (this.xEnd - this.x < 0) {
        this.close()
      }
    }
    delete this.x
    delete this.y
    delete this.xEnd
    delete this.yEnd
  }

  static click(e) {
    this.close()
  }

  static open() {
    this.menu.classList.add('active')
    this.burger.classList.add('active')
    Object.assign(document.documentElement.style, { overflow: 'hidden' })
  }

  static close() {
    this.menu.classList.remove('active')
    this.burger.classList.remove('active')
    setTimeout(() => {
      Object.assign(document.documentElement.style, { overflow: 'visible' })
    }, 220)
  }
}
