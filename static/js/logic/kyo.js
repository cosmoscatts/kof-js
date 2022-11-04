/*
  草薙京角色
 */
import { Player } from './Player.js'
import { GIF } from '/static/js/utils/gif.js'

export class Kyo extends Player {
  constructor(root, info) {
    super(root, info)

    this.initAnimations()
  }

  initAnimations() {
    let outer = this
    let offsets = [0, -22, -22, -140, 0, 0, 0]
    for (let i = 0; i < 7; i++) {
      let gif = GIF()
      gif.load(`/static/images/player/kyo/${i}.gif`)
      this.animations.set(i, {
        gif,
        frameCnt: 0, // 总图片数
        frameRate: 5, // 每 5 帧过渡一次
        offsetY: offsets[i],
        loaded: false,
        scale: 2,
      })

      gif.onload = () => {
        const obj = outer.animations.get(i)
        obj.frameCnt = gif.frames.length
        obj.loaded = true

        if (i === 3) {
          obj.frameRate = 4
        }
      }
    }
  }
}
