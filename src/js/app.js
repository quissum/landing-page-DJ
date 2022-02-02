import { Sidenav } from './modules/sidenav.js'
import { MyAudio } from './modules/audio.js'
import { Slider } from './modules/slider.js'

Sidenav.init('.burger', '.burger-menu')

MyAudio.init(
  ['playerTop', 'playerMain'],
  [
    ['Bright Lights, Kaleena Zanders, Kandy — War For Love'],
    [
      '3lau & Bright Lights - How You Love Me',
      'Bright Lights, Kaleena Zanders, Kandy — War For Love',
      'Benny Benassi & Pink Is Punk feat. Bright Lights - Ghost',
      'Hardwell & Dyro feat. Bright Lights - Never Say Goodbye',
      'Zeds Dead & Dirtyphonics feat. Bright Lights - Where Are You Now',
      'Zedd, Bright Lights - Follow You Down',
    ],
  ]
)

Slider.init('#slider', {})
