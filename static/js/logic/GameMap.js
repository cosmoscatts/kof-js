import { GameObject } from './index.js'
import { Controller } from './Controller.js'

export class GameMap extends GameObject {
  constructor(root) {
    super()

    this.root = root
    this.$canvas = $('<canvas width="1280" height="720" tabindex="0"></canvas>')
    this.ctx = this.$canvas[0].getContext('2d')
    this.root.$kof.append(this.$canvas)
    this.$canvas.focus()

    this.controller = new Controller(this.$canvas)

    this.root.$kof.append($(
      `<div class="kof-head">
        <div class="kof-head-hp-0"><div><div></div></div></div>
        <div class="kof-head-timer">60</div>
        <div class="kof-head-hp-1"><div><div></div></div></div>
       </div>
      `
    ))
    
    this.timeLeft = 60000 // ms
    this.$timer = this.root.$kof.find('.kof-head-timer')
  }

  start() {

  }

  update() {
    this.timeLeft -= this.timeDelta
    if (this.timeLeft < 0) {
      this.timeLeft = 0

      const [a, b] = this.root.players
      if (a.status !== 6 && b.status !== 6) {
        a.status = b.status = 6
        a.frameCurrentCnt = b.frameCurrentCnt = 0
        a.vx = b.vx = 0
      }
    }

    this.$timer.text(parseInt(this.timeLeft / 1000))
    this.render()
  }

  render() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }
}


