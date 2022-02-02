export class MyAudio {
  static init(players, songs) {
    this.$play = this.arrayFromElements('[data-el="play"]')
    this.$progressBar = this.arrayFromElements('[data-el="progressBar"]')
    this.$progress = this.arrayFromElements('[data-el="progress"]')
    this.$currentTime = this.arrayFromElements('[data-el="currentTime"]')
    this.$duration = this.arrayFromElements('[data-el="duration"]')
    this.$links = this.arrayFromElements('[data-el="song"]')

    this.songs = songs
    this.players = players
    this.indexSongs = 0
    this.indexPlayers = 0
    this.updateProgress = true
    this.cache = []

    this.audio = new Audio(
      `files/audio/${songs[this.indexPlayers][this.indexSongs]}.mp3`
    )

    this.audio.addEventListener('loadeddata', this.loaded.bind(this))
    this.audio.addEventListener('ended', this.next.bind(this))
    this.audio.addEventListener('timeupdate', this.timeupdate.bind(this))
    this.$play.forEach($play =>
      $play.addEventListener('click', this.click.bind(this))
    )
    this.$progressBar.forEach($progressBar =>
      $progressBar.addEventListener('mousedown', this.mousedown.bind(this))
    )
    document.addEventListener('click', this.clickLink.bind(this))

    this.mousemoveFunc = this.mousemove.bind(this)
    this.mouseupFunc = this.mouseup.bind(this)
    this.start()
  }

  static start() {
    this.players.forEach((target, i) => {
      const player = new Audio(`files/audio/${this.songs[i][0]}.mp3`)

      player.addEventListener('loadedmetadata', () => {
        this.$duration[i].innerHTML = this.time(player.duration)
      })

      this.changeLink(target)
    })
  }

  static clickLink(e) {
    const target = e.target.dataset.target
    const indexPlayers = this.players.findIndex(p => p === target)

    if (indexPlayers >= 0) {
      const links = this.filterLinks(target)
      const songsIndex = links.findIndex(link => link === e.target)

      this.pushCache()

      if (this.indexPlayers !== indexPlayers) {
        this.$play[this.indexPlayers].classList.remove('active')
        this.$play[indexPlayers].classList.add('active')
        this.indexPlayers = indexPlayers
      }

      this.indexSongs = songsIndex

      this.audio.src = `files/audio/${
        this.songs[this.indexPlayers][this.indexSongs]
      }.mp3`

      this.playSong()
      this.changeLink(target)
    }
  }

  static changeLink(target) {
    const links = this.filterLinks(target)

    links.forEach((link, i) => {
      if (i === this.indexSongs) {
        link.classList.add('active')
      } else {
        link.classList.remove('active')
      }
    })
  }

  static filterLinks(target) {
    return this.$links.filter(link => link.dataset.target === target)
  }

  static mousedown(e) {
    if (e.target.closest(`#${this.players[this.indexPlayers]}`)) {
      document.addEventListener('mousemove', this.mousemoveFunc)
      document.addEventListener('mouseup', this.mouseupFunc)
      this.updateProgress = false
    }
  }

  static mousemove(e) {
    const { position, width } = this.positionProgress(e)
    const percentage = this.computePercentage(position, width)

    this.styleProgress(percentage)
  }

  static mouseup(e) {
    document.removeEventListener('mousemove', this.mousemoveFunc)
    document.removeEventListener('mouseup', this.mouseupFunc)

    const { position } = this.positionProgress(e)

    this.setProgress({ offsetX: position })

    this.updateProgress = true
  }

  static click(e) {
    this.pushCache()

    const player = e.target.closest('.audio-block').id

    this.players.forEach((el, i) => {
      if (el === player && this.indexPlayers !== i) {
        this.changePlayer(i)
      }
    })

    if (e.target.classList.contains('active')) {
      e.target.classList.remove('active')
      this.pauseSong()
    } else {
      e.target.classList.add('active')
      this.playSong()
    }
  }

  static pushCache() {
    const indexPlayers = this.indexPlayers
    const indexSongs = this.indexSongs
    const currentTime = this.audio.currentTime

    let change = false

    this.cache.forEach((item, i) => {
      if (item.indexPlayers === indexPlayers) {
        change = true
        this.cache[i] = { indexPlayers, indexSongs, currentTime }
        return
      }
    })

    if (!change) this.cache.push({ indexPlayers, indexSongs, currentTime })
  }

  static changePlayer(i) {
    this.$play[this.indexPlayers].classList.remove('active')
    this.indexPlayers = i

    const cache = this.cache.find(el => el.indexPlayers === this.indexPlayers)

    this.indexSongs = cache ? cache.indexSongs : 0

    this.audio.src = `files/audio/${
      this.songs[this.indexPlayers][this.indexSongs]
    }.mp3`
    this.audio.currentTime = cache ? cache.currentTime : 0
  }

  static next() {
    this.indexSongs++

    if (this.indexSongs === this.songs[this.indexPlayers].length)
      this.indexSongs = 0

    this.audio.src = `files/audio/${
      this.songs[this.indexPlayers][this.indexSongs]
    }.mp3`

    this.audio.addEventListener('loadeddata', () => {
      this.loaded()
      this.playSong()
      this.changeLink(this.players[this.indexPlayers])
    })

    if (!this.$play[this.indexPlayers].classList.contains('active'))
      this.$play[this.indexPlayers].classList.add('active')
  }

  static loaded() {
    this.duration = this.audio.duration

    this.audio.volume = 0.1

    this.$duration[this.indexPlayers].innerHTML = this.time(this.duration)
  }

  static timeupdate() {
    const currentTime = this.audio.currentTime

    this.$currentTime[this.indexPlayers].innerHTML = this.time(currentTime)

    if (this.updateProgress) {
      const percentage = this.computePercentage(currentTime, this.duration)
      this.styleProgress(percentage)
    }
  }

  static setProgress(e) {
    const { width } =
      this.$progressBar[this.indexPlayers].getBoundingClientRect()
    const x = e.offsetX

    const setTime = (x / width) * this.duration
    const percentage = this.computePercentage(x, width)

    this.styleProgress(percentage)
    this.audio.currentTime = setTime
  }

  static positionProgress(e) {
    const { pageX } = e
    const { x, width } =
      this.$progressBar[this.indexPlayers].getBoundingClientRect()
    const position = pageX - x

    let res

    if (position >= 0 && position <= width) res = position
    else if (position < 0) res = 0
    else if (position > width) res = width

    return { position: res, width }
  }

  static computePercentage(unit, full) {
    return (unit / full) * 100
  }

  static styleProgress(percentage) {
    this.$progress[this.indexPlayers].style.width = `${percentage}%`
  }

  static playSong() {
    this.audio.play()
  }
  static pauseSong() {
    this.audio.pause()
  }

  static arrayFromElements(selector) {
    return Array.from(document.querySelectorAll(selector))
  }

  static time(time) {
    const minute = this.computeTime(time, 'MINUTE')
    const second = this.computeTime(time, 'SECOND')

    return `${minute}:${second}`
  }

  static computeTime(ms, type) {
    const time = Math.floor(type === 'MINUTE' ? ms / 60 : ms % 60)

    let res

    if ((ms >= 60 && type === 'MINUTE') || (ms && type === 'SECOND'))
      res = time >= 10 ? time : `0${time}`
    else res = '00'

    return res
  }
}
